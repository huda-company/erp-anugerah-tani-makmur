import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import Branch from "^/mongodb/schemas/branch";
import User from "^/mongodb/schemas/user";
import { onRoleFilter } from "./config/filter";
import Role from "^/mongodb/schemas/role";
import moment from "moment";
import { pageRowsArr } from "^/config/request/config";

export const getRoles = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onRoleFilter(req.query as any);

  const users = await Role.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[0],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
  });

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: users });
};

export const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, gender, birthDate, phone } = req.body;

  await connectToDatabase();

  try {
    const checkUser = await User.findOne({
      $or: [{ email: email }],
    });

    if (checkUser) {
      return res
        .status(400)
        .json(respBody.ERROR.EMAIL_OR_PHONE_ALREADY_REGISTERED);
    } else {
      //create new user on mongodb
      const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        plainPassword: password,
        gender,
        birthDate,
        phone,
        roles: ["64e1ecd926ee98912a1510e0"],
        removed: false,
        enabled: true,
      });

      return res.status(200).json({
        ...respBody.SUCCESS.NEW_USER_CREATE,
        success: true,
        data: newUser,
      });
    }
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
