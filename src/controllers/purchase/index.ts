import { ISortOptions, SupplierResp } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import Purchase from "^/mongodb/schemas/purchase";
import { onPurchaseFilter } from "./config/filter";
import generatePoNumber from "^/utils/generatePoNo";
import { calculateGrandTotal } from "^/config/purchase/config";
import moment from "moment";
import { pageRowsArr } from "^/config/request/config";
import { PurchaseStatus } from "^/@types/models/purchase";
import Supplierstock from "^/mongodb/schemas/supplierstock";
import Supplierstockhist from "^/mongodb/schemas/supplierstockhist";
import { SuppStockTypes } from "^/@types/models/supplierstockhist";
import {
  AdjustSuppStockPrm,
  UpdtSuppStockPrm,
} from "^/@types/models/supplierstock";

export const getPurchases = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  try {
    await connectToDatabase();

    const sortOptions: ISortOptions = { createdAt: -1 }; // Define default sort option

    const filter: any = onPurchaseFilter(req.query as any);

    const purchases = await Purchase.paginate(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || pageRowsArr[0],
      customLabels: MONGODB.PAGINATION_LABEL,
      sort: sortOptions,
      populate: [
        { path: "supplier" },
        {
          path: "items.item",
          justOne: true,
          model: "Item", // This should be the name of your Item model
        },
      ],
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: purchases });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const createPurchase = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    supplier,
    soNumber,
    billingCode,
    year,
    expDate,
    purchPaymentMethod,
    items,
    taxTotal,
    discount,
    note,
    poNo: poNoReq,
  } = req.body;

  if (!supplier)
    return res.status(400).json({ ...respBody.ERROR.INVALID_SUPP_ID });

  await connectToDatabase();

  const poNo = await generatePoNumber(supplier);

  try {
    const subTotal = calculateGrandTotal(items);
    const grandTotal = subTotal + (taxTotal ?? 0) - (discount ?? 0);

    const dataToInsert = {
      number: 1,
      supplier,
      soNumber,
      poNo: poNoReq || poNo,
      billingCode,
      year,
      expDate,
      purchPaymentMethod,
      items,
      subTotal,
      discount,
      taxTotal,
      grandTotal,
      note,
    };

    const field = await Purchase.create(dataToInsert);

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.NEW_PURCHASE_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const updatePurchase = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const {
    supplier,
    soNumber,
    billingCode,
    year,
    expDate,
    purchPaymentMethod,
    items,
    taxTotal,
    discount,
    note,
  } = req.body;

  await connectToDatabase();

  try {
    const subTotal = calculateGrandTotal(items);
    const grandTotal = subTotal + (taxTotal ?? 0) - (discount ?? 0);

    const newData = {
      number: 1,
      supplier,
      soNumber,
      billingCode,
      year,
      expDate,
      purchPaymentMethod,
      items,
      subTotal,
      discount,
      taxTotal,
      grandTotal,
      note,
    };

    const field = await Purchase.findOneAndUpdate(
      { _id: String(id) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.PURCHASE_UPDATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const deletePurchase = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await Purchase.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.PURCHASE_DELETE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const approvePurchase = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const checkPurch = await Purchase.findById(id);
    if (!checkPurch)
      return res.status(400).json({ ...respBody.ERROR.INVALID_PO });

    if (checkPurch.status == PurchaseStatus.RELEASED)
      return res
        .status(400)
        .json({ ...respBody.ERROR.PURCHASE_ALREADY_RELEASED });

    const updatedPO = await Purchase.findOneAndUpdate(
      { _id: checkPurch._id },
      { $set: { status: PurchaseStatus.APPROVED } },
      { returnOriginal: false }
    );

    if (updatedPO) {
      const supp = updatedPO.supplier as unknown as SupplierResp;

      //loop items for updating supplierstock and supplierstock hsitory
      await updatedPO.items.forEach(async (itm: any) => {
        await adjustSupplierStock({
          purchase: String(checkPurch.id),
          item: itm.item,
          supplier: supp.id,
          type: SuppStockTypes.APPROVED_PO,
          ref: JSON.stringify(checkPurch),
          detail: "",
          qty: itm.quantity,
        });
      });

      return res
        .status(200)
        .json({ ...respBody.SUCCESS.PURCHASE_APPROVED, data: updatedPO });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        ...respBody.ERROR.UNEXPECTED_ERROR,
        message: "approvePurchase",
        error: error,
      });
  }
};

export const determineMinusOrPlus = (type: SuppStockTypes, qty: number) => {
  let res = qty;
  if (type == SuppStockTypes.PURCHASE_PAYMENT_ADD) res = -qty;
  return res;
};

export const adjustSupplierStock = async (prm: AdjustSuppStockPrm) => {
  try {
    await connectToDatabase();

    const compareSuppItem = {
      item: prm.item,
      supplier: prm.supplier,
    };

    const adjustedQty = determineMinusOrPlus(prm.type, prm.qty);

    const suppItmStockObj: UpdtSuppStockPrm = {
      suppStockId: "",
      purchase: prm.purchase,
      item: prm.item,
      supplier: prm.supplier,
      type: prm.type,
      qty: adjustedQty,
      finalQty: adjustedQty,
      ref: prm.ref,
      detail: prm.detail,
    };

    const findSuppStock = await Supplierstock.findOne(compareSuppItem);
    if (findSuppStock) {
      updateSuppStock({
        ...suppItmStockObj,
        purchase: prm.purchase,
        suppStockId: findSuppStock.id,
        ref: prm.ref,
        qty: adjustedQty,
        finalQty: findSuppStock.stock + adjustedQty,
      });
    } else {
      addNewSuppStockThenUpdate(suppItmStockObj);
    }
  } catch (error) {
    return `error adjustSupplierStock : ${error}`;
  }
};

export const updateSuppStock = async (prm: UpdtSuppStockPrm) => {
  if (!prm.suppStockId) return `error updateSuppStock : no suppStockId`;

  try {
    await connectToDatabase();

    const updtNumOfStock = { stock: prm.finalQty };

    const updSuppStock = await Supplierstock.findOneAndUpdate(
      { _id: prm.suppStockId },
      { $set: updtNumOfStock },
      { returnOriginal: false }
    );

    if (updSuppStock) {
      await Supplierstockhist.create({
        suppStockId: prm.suppStockId,
        purchase: prm.purchase,
        type: prm.type,
        ref: prm.ref,
        date: Date.now(),
        number: prm.qty,
      });
    }
  } catch (error) {
    return `error updateSuppStock : ${error}`;
  }
};

export const addNewSuppStockThenUpdate = async (prm: UpdtSuppStockPrm) => {
  try {
    await connectToDatabase();

    const addSuppStock = await Supplierstock.create({
      item: prm.item,
      supplier: prm.supplier,
      stock: 0,
    });

    if (addSuppStock) {
      await updateSuppStock({
        ...prm,
        suppStockId: addSuppStock.id,
        qty: addSuppStock.stock + prm.qty,
      });
    }
  } catch (error) {
    return `error addNewSuppStockThenUpdate : ${error}`;
  }
};
