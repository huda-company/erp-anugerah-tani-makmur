import * as formidable from "formidable";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { respBody } from "^/config/serverResponse";
import Purchase from "^/mongodb/schemas/purchase";
import moment from "moment";
import Billdoc from "^/mongodb/schemas/billdoc";
import Paymentmode from "^/mongodb/schemas/paymentmode";
import Paymentpurchase from "^/mongodb/schemas/paymentpurchase";
import connectToDatabase from "^/mongodb/connDb";
import { billDocDir } from "@/constants/uploadDir";
import { onBillDocFilter } from "./config/filter";
import { ISortOptions } from "^/@types/models/billdoc";
import { MONGODB } from "^/config/mongodb";
import { pageRowsArr } from "^/config/request/config";
import { PurchaseStatus } from "^/@types/models/purchase";

const pathDist: string = path.join(process.cwd(), billDocDir);

//https://github.com/vercel/next.js/issues/50147
export const addBillDoc = async (req: any, res: any) => {
  const { id: purchId } = req.query;
  try {
    await fs.readdir(pathDist);
  } catch (error) {
    await fs.mkdir(pathDist);
  }

  try {
    await connectToDatabase();

    const checkPurchase = await Purchase.findById(purchId);

    if (!checkPurchase) {
      return res.status(400).json({ ...respBody.ERROR.INVALID_PO });
    }

    const currentDateTime = moment();
    const newFileName = currentDateTime.format("YYYYMMDDHHmmssSSS");
    const namefile = `${checkPurchase?.id}_${newFileName}`;

    const { fields, files } = await readFile(req, namefile, true, pathDist);
    const firstFile = (files as any).file[0];
    const extFile = firstFile.originalFilename.split(".")[1];

    const { title, description } = fields;

    if (!title || !description || !files || !files.file) {
      return res.status(400).json({ ...respBody.ERROR.INCORRECT_PAYLOAD });
    }

    const titlePrm = title[0];
    const descriptionPrm = description[0];

    //create billdoc
    const bdParam: any = {
      purchase: purchId,
      title: titlePrm,
      description: descriptionPrm,
      fileName: `${namefile}.${extFile}`,
    };
    const crtBilldoc = await Billdoc.create(bdParam);

    if (!crtBilldoc) {
      return res.status(200).json({ ...respBody.ERROR.UPLOAD_ERROR });
    }

    let newStat = checkPurchase.status;

    if (
      ["invoice", "billing code"].includes(
        String(titlePrm).trim().toLowerCase()
      )
    ) {
      newStat = PurchaseStatus.APPROVED;
    } else if (
      ["file evidence"].includes(String(titlePrm).trim().toLowerCase())
    ) {
      newStat = PurchaseStatus.RELEASED;
    }

    // perform update purchase order
    const updateObj = {
      status: newStat,
    };

    const updatedPO = await Purchase.findOneAndUpdate(
      { _id: checkPurchase._id },
      { $set: updateObj },
      { returnOriginal: false }
    );

    if (!updatedPO) {
      return res.status(200).json({ ...respBody.ERROR.PURCHASE_UPDATE });
    }

    // insert to paym purchase
    const cash = await Paymentmode.findOne({ name: "cash" }).lean();
    if (cash) {
      const payPurch = {
        purchase: checkPurchase._id,
        amount: Number(checkPurchase.grandTotal),
        paymentMode: cash._id,
      };
      Paymentpurchase.create(payPurch);
    }
    return res
      .status(200)
      .json({ ...respBody.SUCCESS.UPLOAD_FILE_SUCCESS, data: updatedPO });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const readFile = (
  req: NextApiRequest,
  newFilename: string,
  saveLocally: boolean,
  pathDistPrm: string
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = pathDistPrm;
    // eslint-disable-next-line unused-imports/no-unused-vars
    options.filename = (name, ext, path, form) => {
      return `${newFilename}${ext}`;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  options.keepExtensions = true;

  const form = formidable.default(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export const readWoFile = (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  // if (saveLocally) {
  //   options.uploadDir = pathDistPrm;
  //   // eslint-disable-next-line unused-imports/no-unused-vars
  //   options.filename = (name, ext, path, form) => {
  //     return `${newFilename}${ext}`;
  //   };
  // }
  // options.maxFileSize = 4000 * 1024 * 1024;
  // options.keepExtensions = true;

  const form = formidable.default(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export const getBilldocs = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onBillDocFilter(req.query as any);

  const billdocs = await Billdoc.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[2],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
  });

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: billdocs });
};
