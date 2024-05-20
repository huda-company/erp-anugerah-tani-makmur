import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { onSupplierFilter } from "./config/filter";
import Supplier from "^/mongodb/schemas/supplier";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import { firstLetterWord, formatNumberToNDigits } from "^/utils/helpers";
import moment from "moment";
import { pageRowsArr } from "^/config/request/config";

export const getSuppliers = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onSupplierFilter(req.query as any);

  const parkingFields = await Supplier.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[0],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
  });

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: parkingFields });
};

export const addSupplier = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    name,
    company,
    managerName,
    managerSurname,
    email,
    bankAccount,
    address,
    tel,
  } = req.body;

  await connectToDatabase();

  try {
    let dataToInsert = {
      name,
      address,
      company,
      managerName,
      managerSurname,
      bankAccount,
      tel,
      email,
    };

    let suppCode = (await firstLetterWord(company)).trim();

    const checkCompCode = await Supplier.find({ supplierCode: suppCode });
    if (checkCompCode.length > 0) {
      suppCode = `${suppCode}${formatNumberToNDigits(checkCompCode.length, 2)}`;
    }

    const field = await Supplier.create({
      ...dataToInsert,
      supplierCode: suppCode,
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.NEW_SUPPLIER_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const updateSupplier = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const {
    name,
    company,
    managerName,
    managerSurname,
    email,
    bankAccount,
    address,
    tel,
  } = req.body;

  await connectToDatabase();

  try {
    const newData = {
      name,
      company,
      managerName,
      managerSurname,
      email,
      bankAccount,
      address,
      tel,
    };

    const field = await Supplier.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.SUPPLIER_UPDATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const deleteSupplier = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await Supplier.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.SUPPLIER_DELETE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
