import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { respBody } from "^/config/serverResponse";
import Paymentpurchase from "^/mongodb/schemas/paymentpurchase";
import connectToDatabase from "^/mongodb/connDb";
import { purchPaymentDir } from "@/constants/uploadDir";
import { onPaymentPurchaseFilter } from "./config/filter";
import { ISortOptions } from "^/@types/models/billdoc";
import Purchase from "^/mongodb/schemas/purchase";
import { readWoFile } from "../billdoc";
import Paymentmode from "^/mongodb/schemas/paymentmode";
import moment from "moment";
import { ObjectId } from "mongodb";
import { MONGODB } from "^/config/mongodb";
import { adjustSupplierStock } from "../purchase";
import { SuppStockTypes } from "^/@types/models/supplierstockhist";
import { SupplierResp } from "^/@types/models/supplier";
import { adjustStock } from "../stock";
import { StockActivityTypes } from "^/@types/models/stockhist";
import { adjustCashflowBlnce } from "../cashflow";
import { CashflowActTypes } from "^/@types/models/cashflowhist";

const purchPaymPathDist: string = path.join(process.cwd(), purchPaymentDir);

//https://github.com/vercel/next.js/issues/50147
export const addPaymentPurchase = async (req: any, res: any) => {
  const { id: purchId } = req.query;
  try {
    await fs.readdir(purchPaymPathDist);
  } catch (error) {
    await fs.mkdir(purchPaymPathDist);
  }

  try {
    await connectToDatabase();

    const checkPurchase = await Purchase.findById(purchId);

    if (!checkPurchase) {
      return res.status(400).json({ ...respBody.ERROR.INVALID_PO });
    }

    const gTotal = checkPurchase.grandTotal;
    let paymAmt = 0;
    let diff = 0;

    const paymHist = await Paymentpurchase.find({
      purchase: purchId,
      removed: "",
    });

    if (paymHist) {
      diff = gTotal - paymAmt;
      paymAmt = paymHist.reduce((acc, doc) => acc + doc.amount, 0);
    }

    const { fields } = await readWoFile(req);

    const {
      amount,
      paymentMode,
      item,
      price,
      quantity,
      unit,
      total,
      date,
      description,
    } = fields;

    if (
      !amount ||
      !paymentMode ||
      !item ||
      !price ||
      !unit ||
      !quantity ||
      !total
    ) {
      return res.status(400).json({ ...respBody.ERROR.INCORRECT_PAYLOAD });
    }

    // items format conversion
    const items = item[0].split(";");
    const units = unit[0].split(";");
    const prices = price[0].split(";").map(Number);
    const quantities = quantity[0].split(";").map(Number);
    const totals = total[0].split(";").map(Number);

    // Create an array of objects dynamically
    const formattedItems = items.map((item, index) => ({
      item,
      unit: units[index],
      price: prices[index],
      quantity: quantities[index],
      total: totals[index],
    }));

    const amt = amount[0];
    const desc = description && description[0] ? description[0] : "";
    const dateCreated =
      date && date[0] ? date[0] : moment().utcOffset(+7).toString();
    const paymMode = paymentMode[0];

    if (paymAmt >= gTotal || diff <= 0 || diff < Number(amt)) {
      return res.status(400).json({ ...respBody.ERROR.GTOTAL_N_PAYMENT_EQUAL });
    }

    const pMode = await Paymentmode.findOne({ name: String(paymMode) }).lean();

    const addPurcPaym = await Paymentpurchase.create({
      purchase: checkPurchase._id,
      date: dateCreated,
      amount: Number(amt),
      paymentMode: pMode?._id,
      items: formattedItems,
      description: desc,
    });

    if (!addPurcPaym)
      return res
        .status(400)
        .json({ ...respBody.ERROR.PURCHASE_PAYMENT_CREATE });

    //loop items for updating supplierstock and supplierstock hsitory
    const supp = checkPurchase.supplier as unknown as SupplierResp;

    await formattedItems.forEach(async (itm: any) => {
      await adjustSupplierStock({
        purchase: String(checkPurchase.id),
        item: itm.item,
        supplier: supp.id,
        type: SuppStockTypes.PURCHASE_PAYMENT_ADD,
        ref: JSON.stringify(addPurcPaym),
        detail: "",
        qty: itm.quantity,
      });

      await adjustStock({
        branch: "664e571da7147636b4525d0f",
        item: itm.item,
        purchase: String(checkPurchase.id),
        type: StockActivityTypes.PURCHASE_PAYMENT_ADD,
        ref: JSON.stringify(addPurcPaym),
        qty: itm.quantity,
      });
    });

    await adjustCashflowBlnce({
      branch: "664e571da7147636b4525d0f",
      purchase: String(checkPurchase.id),
      type: CashflowActTypes.PURCHASE_PAYMENT_ADD,
      ref: JSON.stringify(addPurcPaym),
      amount: Number(amt),
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.PURCHASE_PAYMENT_CREATE, data: addPurcPaym });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const getPaymentPurch = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = { createdAt: -1 }; // Define an empty object for sort options

  const filter: any = onPaymentPurchaseFilter(req.query as any);

  const aggregate = Paymentpurchase.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "pickupdocs", // The name of the PickupDoc collection
        localField: "_id",
        foreignField: "paymentPurchase",
        as: "pickupDocs",
      },
    },
    {
      $unwind: {
        path: "$pickupDocs",
        preserveNullAndEmptyArrays: true, // If you want to keep Paymentpurchases without Pickupdocs
      },
    },
    {
      $unwind: {
        path: "$items",
        preserveNullAndEmptyArrays: true, // If you want to keep Paymentpurchases without items
      },
    },
    {
      $lookup: {
        from: "items", // The name of the Item collection
        localField: "items.item",
        foreignField: "_id",
        as: "itemDetails",
      },
    },
    {
      $unwind: {
        path: "$itemDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "items.item": "$itemDetails",
      },
    },
    {
      $group: {
        _id: "$_id",
        removed: { $first: "$removed" },
        purchase: { $first: "$purchase" },
        items: { $push: "$items" },
        date: { $first: "$date" },
        amount: { $first: "$amount" },
        paymentMode: { $first: "$paymentMode" },
        ref: { $first: "$ref" },
        description: { $first: "$description" },
        updatedAt: { $first: "$updatedAt" },
        createdAt: { $first: "$createdAt" },
        pickupDocs: { $first: "$pickupDocs" },
      },
    },
    {
      $sort: {
        "pickupDocs.createdAt": -1, // Example sorting by pickupDocs' updatedAt field
      },
    },
    {
      $project: {
        // Add any specific fields you want to include in the response
        _id: 1,
        removed: 1,
        purchase: 1,
        items: 1,
        date: 1,
        amount: 1,
        paymentMode: 1,
        ref: 1,
        description: 1,
        updatedAt: 1,
        createdAt: 1,
        "pickupDocs._id": 1,
        "pickupDocs.code": 1,
        "pickupDocs.type": 1,
        "pickupDocs.note": 1,
        "pickupDocs.vehicleType": 1,
        "pickupDocs.driverName": 1,
        "pickupDocs.updatedAt": 1,
        "pickupDocs.createdAt": 1,
      },
    },
  ]);

  const options = {
    customLabels: MONGODB.PAGINATION_LABEL,
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: sortOptions,
  };

  const paymPurchases = await Paymentpurchase.aggregatePaginate(
    aggregate,
    options
  );

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: paymPurchases });
};

export const deletePaymentPurch = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  await connectToDatabase();

  const checkPaymPurchase = await Paymentpurchase.findById(id);

  if (!checkPaymPurchase) {
    return res.status(400).json({ ...respBody.ERROR.INVALID_PAYMENT_PURCH_ID });
  }

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await Paymentpurchase.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    const checkPurchase = await Purchase.findById(
      checkPaymPurchase.purchase._id
    );

    if (!checkPurchase) {
      return res.status(400).json({ ...respBody.ERROR.INVALID_PO });
    }

    //loop items for updating supplierstock and supplierstock hsitory
    const supp = (await checkPurchase.supplier) as unknown as SupplierResp;

    await checkPaymPurchase.items.forEach(async (itm: any) => {
      const paymPurchQty = checkPaymPurchase.items.find(
        (x) => x.item.toString() == itm.item.toString()
      );
      if (paymPurchQty) {
        await adjustSupplierStock({
          purchase: String(checkPurchase.id),
          item: itm.item,
          supplier: supp.id,
          type: SuppStockTypes.PURCHASE_PAYMENT_DEL,
          ref: JSON.stringify(checkPaymPurchase),
          qty: itm.quantity,
        });

        await adjustStock({
          branch: "664e571da7147636b4525d0f",
          item: itm.item,
          purchase: String(checkPurchase.id),
          type: StockActivityTypes.PURCHASE_PAYMENT_DEL,
          ref: JSON.stringify(checkPaymPurchase),
          qty: itm.quantity,
        });
      }
    });

    await adjustCashflowBlnce({
      branch: "664e571da7147636b4525d0f",
      purchase: String(checkPurchase.id),
      type: CashflowActTypes.PURCHASE_PAYMENT_DEL,
      ref: JSON.stringify(checkPaymPurchase),
      amount: Number(checkPaymPurchase.amount),
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.PURCHASE_PAYMENT_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
