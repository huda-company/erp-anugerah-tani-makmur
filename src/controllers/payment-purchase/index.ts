import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { respBody } from "^/config/serverResponse";
import Paymentpurchase from "^/mongodb/schemas/paymentpurchase";
import connectToDatabase from "^/mongodb/connDb";
import { purchPaymentDir } from "@/constants/uploadDir";
import { onPaymentPurchaseFilter } from "./config/filter";
import { ISortOptions } from "^/@types/models/billdoc";
import { MONGODB } from "^/config/mongodb";
import Purchase from "^/mongodb/schemas/purchase";
import { readWoFile } from "../billdoc";
import Paymentmode from "^/mongodb/schemas/paymentmode";
import moment from "moment";
import { ObjectId } from "mongodb";
import { pageRowsArr } from "^/config/request/config";

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

    const { amount, paymentMode } = fields;

    if (!amount || !paymentMode) {
      return res.status(400).json({ ...respBody.ERROR.INCORRECT_PAYLOAD });
    }

    const amt = amount[0];
    const paymMode = paymentMode[0];

    if (paymAmt >= gTotal || diff <= 0 || diff < Number(amt)) {
      return res.status(400).json({ ...respBody.ERROR.GTOTAL_N_PAYMENT_EQUAL });
    }

    const pMode = await Paymentmode.findOne({ name: String(paymMode) }).lean();

    const addPurcPaym = Paymentpurchase.create({
      purchase: checkPurchase._id,
      amount: Number(amt),
      paymentMode: pMode?._id,
    });

    if (!addPurcPaym)
      return res
        .status(400)
        .json({ ...respBody.ERROR.PURCHASE_PAYMENT_CREATE });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.UPLOAD_FILE_SUCCESS, data: addPurcPaym });
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

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onPaymentPurchaseFilter(req.query as any);

  const paymPurchases = await Paymentpurchase.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[2],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
    populate: [
      {
        path: "paymentMode",
        justOne: true,
        model: "Paymentmode", // This should be the name of your Item model
      },
    ],
  });

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

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await Paymentpurchase.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.ITEM_CAT_DELETE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
