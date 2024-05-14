import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { pageRowsArr } from "^/config/supplier/config";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import Purchase from "^/mongodb/schemas/purchase";
import { onPurchaseFilter } from "./config/filter";
import generatePoNumber from "^/utils/generatePoNo";
import { calculateGrandTotal } from "^/config/purchase/config";
import moment from "moment";

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
  } = req.body;

  await connectToDatabase();

  const poNo = await generatePoNumber(supplier);

  try {
    const subTotal = calculateGrandTotal(items);
    const grandTotal = subTotal + (taxTotal ?? 0) - (discount ?? 0);

    const dataToInsert = {
      number: 1,
      supplier,
      soNumber,
      poNo: poNo,
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
