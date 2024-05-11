import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { pageRowsArr } from "^/config/supplier/config";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { ObjectId } from "mongodb";
import User from "^/mongodb/schemas/user";
import { onUserFilter } from "./config/filter";
import bcrypt from "bcrypt";

export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, limit } = req.query;

  await connectToDatabase();

  const sortOptions: ISortOptions = {}; // Define an empty object for sort options

  const filter: any = onUserFilter(req.query as any);

  const users = await User.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || pageRowsArr[0],
    customLabels: MONGODB.PAGINATION_LABEL,
    sort: sortOptions,
    populate: [{ path: "roles" }],
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

export const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { name, email, password, gender, phone, birthDate, role, enabled } =
    req.body;

  await connectToDatabase();

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.NEXT_SALT_ROUND)
    );

    const newData = {
      name,
      email,
      gender,
      phone,
      birthDate,
      password: hashedPassword,
      plainPassword: password,
      role: [role],
      enabled: enabled == "active" ? true : false,
    };

    const field = await User.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.USER_UPDATE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};

export const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  await connectToDatabase();

  try {
    const newData = { removed: true };

    const field = await User.findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: newData },
      { returnOriginal: false }
    );

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.USER_DELETE, data: field });
  } catch (error) {
    return res
      .status(500)
      .json({ ...respBody.ERROR.UNEXPECTED_ERROR, error: error });
  }
};
