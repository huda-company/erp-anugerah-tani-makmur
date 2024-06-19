import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { onStockFilter } from "./config/filter";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { pageRowsArr } from "^/config/request/config";
import Item from "^/mongodb/schemas/item";
import { onBranchFilter } from "../branch/config/filter";
import Branch from "^/mongodb/schemas/branch";
import { AdjustStockPrm, UpdtStockPrm } from "^/@types/models/stock";
import Stock from "^/mongodb/schemas/stock";
import Stockhist from "^/mongodb/schemas/stockhist";
import { StockActivityTypes } from "^/@types/models/stockhist";

export const getStock = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, limit } = req.query;

  try {
    await connectToDatabase();

    const sortOptions: ISortOptions = {}; // Define an empty object for sort options
    let newQuery = req.query;

    const itemFilter: any = onStockFilter(req.query as any);
    const items = await Item.find(itemFilter);
    if (items) {
      newQuery = {
        ...newQuery,
        ["param[item]"]: items.map((item) => item.id),
      };
    }

    const branchFilter: any = onBranchFilter(req.query as any);
    const branches = await Branch.find(branchFilter);
    if (branches) {
      newQuery = {
        ...newQuery,
        ["param[branch]"]: branches.map((supp) => supp.id),
      };
    }

    const filter: any = onStockFilter(newQuery as any);

    const stock = await Stock.paginate(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || pageRowsArr[0],
      customLabels: MONGODB.PAGINATION_LABEL,
      sort: sortOptions,
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: stock });
  } catch (error) {
    return res.status(500).json({
      ...respBody.ERROR.UNEXPECTED_ERROR,
      error: `getStock : ${error}`,
    });
  }
};

export const determineMinusOrPlusStockAmt = (
  type: StockActivityTypes,
  qty: number
) => {
  let res = qty;
  if (type == StockActivityTypes.PURCHASE_PAYMENT_DEL) res = -qty;
  return res;
};

export const adjustStock = async (prm: AdjustStockPrm) => {
  try {
    await connectToDatabase();

    const compareSuppItem = {
      item: prm.item,
      branch: prm.branch,
    };

    const adjustedQty = determineMinusOrPlusStockAmt(prm.type, prm.qty);

    const suppItmStockObj: UpdtStockPrm = {
      stockId: "",
      purchase: prm.purchase,
      item: prm.item,
      branch: prm.branch,
      type: prm.type,
      qty: adjustedQty,
      finalQty: adjustedQty,
      ref: prm.ref,
      detail: prm.detail,
    };

    const findStock = await Stock.findOne(compareSuppItem);

    if (findStock) {
      updateStock({
        ...suppItmStockObj,
        purchase: prm.purchase,
        stockId: findStock.id,
        ref: prm.ref,
        qty: adjustedQty,
        finalQty: findStock.stock + adjustedQty,
      });
    } else {
      addNewStockThenUpdate(suppItmStockObj);
    }
  } catch (error) {
    return `error adjustSupplierStock : ${error}`;
  }
};

export const updateStock = async (prm: UpdtStockPrm) => {
  if (!prm.stockId) return `error updateStock : no stockId`;

  try {
    await connectToDatabase();

    const updtNumOfStock = { stock: prm.finalQty };

    const updSuppStock = await Stock.findOneAndUpdate(
      { _id: prm.stockId },
      { $set: updtNumOfStock },
      { returnOriginal: false }
    );

    if (updSuppStock) {
      await Stockhist.create({
        stockId: prm.stockId,
        purchase: prm.purchase,
        type: prm.type,
        ref: prm.ref,
        date: Date.now(),
        number: prm.qty,
      });
    }
  } catch (error) {
    return `error updateSuppStock : ${error}`;
  }
};

export const addNewStockThenUpdate = async (prm: UpdtStockPrm) => {
  try {
    await connectToDatabase();

    const addSuppStock = await Stock.create({
      item: prm.item,
      branch: prm.branch,
      stock: 0,
    });

    if (addSuppStock) {
      await updateStock({
        ...prm,
        stockId: addSuppStock.id,
        qty: addSuppStock.stock + prm.qty,
      });
    }
  } catch (error) {
    return `error addNewSuppStockThenUpdate : ${error}`;
  }
};
