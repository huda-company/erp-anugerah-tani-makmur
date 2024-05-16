import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { pageRowsArr } from "^/config/supplier/config";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import Item from "^/mongodb/schemas/item";
import { onItemFilter } from "./config/filter";
import moment from "moment";

export const getItems = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onItemFilter(req.query as any);

  const parkingFields = await Item.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[0],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
  });

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: parkingFields });
};

export const addItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemCategory, name, description, price } = req.body;

  await connectToDatabase();

  try {
    const dataToInsert = {
      itemCategory,
      name,
      description,
      price,
    };

    const field = await Item.create(dataToInsert);

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.NEW_ITEM_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const updateItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { itemCategory, name, description, price } = req.body;

  await connectToDatabase();

  try {
    const newData = {
      itemCategory,
      name,
      description,
      price,
    };

    const field = await Item.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.ITEM_UPDATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const deleteItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await Item.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.ITEM_DELETE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
