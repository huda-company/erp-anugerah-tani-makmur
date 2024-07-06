import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { onDelivNoteFilter } from "./config/filter";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { pageRowsArr } from "^/config/request/config";
import Deliverynote from "^/mongodb/schemas/deliverynote";
import { adjustStock } from "../stock";
import Purchase from "^/mongodb/schemas/purchase";
import { StockActivityTypes } from "^/@types/models/stockhist";

export const getDelivNote = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  try {
    await connectToDatabase();

    const sortOptions: ISortOptions = {}; // Define an empty object for sort options

    const filter: any = onDelivNoteFilter(req.query as any);

    const dNotes = await Deliverynote.paginate(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || pageRowsArr[0],
      customLabels: MONGODB.PAGINATION_LABEL,
      sort: sortOptions,
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: dNotes });
  } catch (error) {
    return res.status(500).json({
      ...respBody.ERROR.UNEXPECTED_ERROR,
      error: `getStock : ${error}`,
    });
  }
};

export const createDelivNote = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    paymentPurchase,
    purchase,
    code,
    soNumber,
    note,
    vehicleType,
    flatNo,
    driverLicenseNo,
    driverName,
    description,
    branch,
    items,
    costItems,
    sellingTotal,
    purchaseTotal,
  } = req.body;

  await connectToDatabase();

  try {
    const dataToInsert = {
      paymentPurchase,
      purchase,
      code,
      soNumber,
      note,
      vehicleType,
      flatNo,
      driverLicenseNo,
      driverName,
      description,
      branch,
      items,
      costItems,
      sellingTotal,
      purchaseTotal,
    };

    const field = await Deliverynote.create(dataToInsert);

    if (field) {
      const findPurch = await Purchase.findById(purchase);

      await items.forEach(async (itm: any) => {
        await adjustStock({
          branch: "664e571da7147636b4525d0f",
          item: itm.item,
          purchase: String(findPurch?.id),
          type: StockActivityTypes.DELIV_NOTE_CREATE_OUT,
          ref: JSON.stringify(field),
          qty: itm.quantity,
        });

        await adjustStock({
          branch: branch,
          item: itm.item,
          purchase: String(findPurch?.id),
          type: StockActivityTypes.DELIV_NOTE_CREATE_IN,
          ref: JSON.stringify(field),
          qty: itm.quantity,
        });
      });
    }

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.DELIV_NOTE_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
