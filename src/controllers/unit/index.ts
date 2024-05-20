import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import { onUnitFilter } from "./config/filter";
import Unit from "^/mongodb/schemas/unit";
import moment from "moment";
import { pageRowsArr } from "^/config/request/config";

export const getUnits = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onUnitFilter(req.query as any);

  const unitDatas = await Unit.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[0],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
  });

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: unitDatas });
};

export const addUnit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, description } = req.body;

  await connectToDatabase();

  try {
    const dataToInsert = {
      name,
      description,
    };

    const field = await Unit.create(dataToInsert);

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.NEW_UNIT_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const updateUnit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { name, description } = req.body;

  await connectToDatabase();

  try {
    const newData = {
      name,
      description,
    };

    const field = await Unit.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.UNIT_UPDATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const deleteUnit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await Unit.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.UNIT_DELETE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
