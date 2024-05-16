import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { pageRowsArr } from "^/config/supplier/config";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import { onBranchFilter } from "./config/filter";
import Branch from "^/mongodb/schemas/branch";
import moment from "moment";

export const getBranches = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onBranchFilter(req.query as any);

  const branches = await Branch.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[0],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
  });

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: branches });
};

export const addBranch = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, address, city, description } = req.body;

  await connectToDatabase();

  try {
    const dataToInsert = {
      name,
      address,
      city,
      description,
    };

    const field = await Branch.create(dataToInsert);

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.NEW_ITEM_CAT_CREATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const updateBranch = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const { name, city, address, description } = req.body;

  await connectToDatabase();

  try {
    const newData = {
      name,
      city,
      address,
      description,
    };

    const field = await Branch.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.BRANCH_UPDATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const deleteBranch = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const newData = {
      removed: moment().utcOffset(+7).toString(),
    };

    const field = await Branch.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.BRANCH_DELETE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
