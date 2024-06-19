import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { respBody } from "^/config/serverResponse";
import Paymentpurchase from "^/mongodb/schemas/paymentpurchase";
import connectToDatabase from "^/mongodb/connDb";
import { pickupDocDir } from "@/constants/uploadDir";
import { onPickupDocFilter } from "./config/filter";
import { ISortOptions } from "^/@types/models/billdoc";
import { MONGODB } from "^/config/mongodb";
import { readWoFile } from "../billdoc";
import moment from "moment";
import { ObjectId } from "mongodb";
import { pageRowsArr } from "^/config/request/config";
import Pickupdoc from "^/mongodb/schemas/pickupdoc";
import { PickupDocType } from "^/@types/models/pickupdoc";

const pickupDocPathDist: string = path.join(process.cwd(), pickupDocDir);

//https://github.com/vercel/next.js/issues/50147
export const addPickupDoc = async (req: any, res: any) => {
  const { id: purchPaymId } = req.query;
  try {
    await fs.readdir(pickupDocPathDist);
  } catch (error) {
    await fs.mkdir(pickupDocPathDist);
  }

  try {
    await connectToDatabase();

    const checkPaymPurch = await Paymentpurchase.findById(purchPaymId);

    if (!checkPaymPurch) {
      return res
        .status(400)
        .json({ ...respBody.ERROR.INVALID_PAYMENT_PURCH_ID });
    }

    const { fields } = await readWoFile(req);

    const {
      code: codeReq,
      type,
      vehicleType,
      flatNo,
      driverName,
      driverLicenseNo,
      note,
      description,
    } = fields;

    if (!type || !vehicleType || !flatNo || !driverName) {
      return res.status(400).json({ ...respBody.ERROR.INCORRECT_PAYLOAD });
    }

    const code = "test";

    const addPickupDocData = await Pickupdoc.create({
      code: codeReq ? codeReq[0] : code,
      paymentPurchase: checkPaymPurch.id,
      purchase: new ObjectId(checkPaymPurch.purchase.id),
      type: type[0] ?? PickupDocType.SPAA,
      vehicleType: vehicleType[0],
      flatNo: flatNo[0],
      driverName: driverName[0],
      driverLicenseNo: driverLicenseNo ? driverLicenseNo[0] : "",
      note: note ? note[0] : "",
      description: description ? description[0] : "",
    });

    if (!addPickupDocData)
      return res
        .status(400)
        .json({ ...respBody.ERROR.PURCHASE_PAYMENT_CREATE });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.PICKUP_DOC_CREATE, data: addPickupDocData });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const getPickupDoc = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onPickupDocFilter(req.query as any);

  const paymPurchases = await Pickupdoc.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[2],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
    populate: [
      {
        path: "paymentPurchase",
        justOne: true,
        model: "Paymentpurchase", // This should be the name of your Item model
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
