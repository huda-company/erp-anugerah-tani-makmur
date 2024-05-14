import { respBody } from "^/config/serverResponse";
import connectToDatabase from "^/mongodb/connDb";
import Branch from "^/mongodb/schemas/branch";
import Item from "^/mongodb/schemas/item";
import ItemCategory from "^/mongodb/schemas/itemCategory";
import Purchase from "^/mongodb/schemas/purchase";
import Supplier from "^/mongodb/schemas/supplier";
import User from "^/mongodb/schemas/user";
import { NextApiRequest, NextApiResponse } from "next";

export const getDashboardStat = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await connectToDatabase();

  const countBranch = (await Branch.countDocuments({ removed: false })) ?? 0;
  const countUserActive =
    (await User.countDocuments({ removed: false, enabled: true })) ?? 0;
  const countUserInActive =
    (await User.countDocuments({ enabled: false })) ?? 0;
  const countPurchase = (await Purchase.countDocuments({ removed: "" })) ?? 0;
  const countItem = (await Item.countDocuments({ removed: false })) ?? 0;
  const countItemCat =
    (await ItemCategory.countDocuments({ removed: false })) ?? 0;
  const countSupplier =
    (await Supplier.countDocuments({ removed: false })) ?? 0;

  const overview = {
    countBranch,
    countUserActive,
    countUserInActive,
    countPurchase,
    countItem,
    countItemCat,
    countSupplier,
  };

  return res
    .status(200)
    .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: overview });
};
