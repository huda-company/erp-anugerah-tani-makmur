import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { onItemCatFilter } from "./config/filter";
import { pageRowsArr } from "^/config/supplier/config";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import ItemCategory from "^/mongodb/schemas/itemCategory";
import moment from "moment";

export const getItemCategories = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onItemCatFilter(req.query as any);

  const itemCategories = await ItemCategory.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[0],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
  });

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: itemCategories });
};

export const addItemCategory = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { name, description } = req.body;

  await connectToDatabase();

  try {
    const dataToInsert = {
      name,
      description,
    };

    const field = await ItemCategory.create(dataToInsert);

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.NEW_ITEM_CAT_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const updateItemCategory = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const { name, description } = req.body;

  await connectToDatabase();

  try {
    const newData = {
      name,
      description,
    };

    const field = await ItemCategory.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.ITEM_CAT_UPDATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const deleteItemCategory = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await ItemCategory.findOneAndUpdate(
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
