import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { onCashflowFilter } from "./config/filter";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { pageRowsArr } from "^/config/request/config";
import { onBranchFilter } from "../branch/config/filter";
import Branch from "^/mongodb/schemas/branch";
import Cashflow from "^/mongodb/schemas/cashflow";
import { AdjustCashflowPrm, UpdtCashflowPrm } from "^/@types/models/cashflow";
import { CashflowActTypes } from "^/@types/models/cashflowhist";
import Cashflowhist from "^/mongodb/schemas/cashflowhist";

export const getCashflow = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  try {
    await connectToDatabase();

    const sortOptions: ISortOptions = {}; // Define an empty object for sort options
    let newQuery = req.query;

    const branchFilter: any = onBranchFilter(req.query as any);
    const branches = await Branch.find(branchFilter);
    if (branches) {
      newQuery = {
        ...newQuery,
        ["param[branch]"]: branches.map((supp) => supp.id),
      };
    }

    const filter: any = onCashflowFilter(newQuery as any);

    const cashflow = await Cashflow.paginate(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || pageRowsArr[0],
      customLabels: MONGODB.PAGINATION_LABEL,
      sort: sortOptions,
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: cashflow });
  } catch (error) {
    return res.status(500).json({
      ...respBody.ERROR.UNEXPECTED_ERROR,
      error: `getCashflow : ${error}`,
    });
  }
};

export const determineMinusOrPlusCashflowAmt = (
  type: CashflowActTypes,
  amt: number
) => {
  let res = amt;
  if (type == CashflowActTypes.PURCHASE_PAYMENT_ADD) res = -amt;
  return res;
};

export const adjustCashflowBlnce = async (prm: AdjustCashflowPrm) => {
  try {
    await connectToDatabase();

    const compareBranch = {
      branch: prm.branch,
    };

    const adjustedAmt = determineMinusOrPlusCashflowAmt(prm.type, prm.amount);

    const cashflowObj: UpdtCashflowPrm = {
      cashflowId: "",
      purchase: prm.purchase,
      branch: prm.branch,
      type: prm.type,
      amount: adjustedAmt,
      finalAmt: adjustedAmt,
      ref: prm.ref,
      detail: prm.detail,
    };

    const findCashflow = await Cashflow.findOne(compareBranch);

    if (findCashflow) {
      updateCashflow({
        ...cashflowObj,
        purchase: prm.purchase,
        cashflowId: findCashflow.id,
        ref: prm.ref,
        amount: adjustedAmt,
        finalAmt: findCashflow.balance + adjustedAmt,
      });
    } else {
      addNewCashflowThenUpdate(cashflowObj);
    }
  } catch (error) {
    return `error adjustCashflowBlnce : ${error}`;
  }
};

export const updateCashflow = async (prm: UpdtCashflowPrm) => {
  if (!prm.cashflowId) return `error updateCashflow : no cashflowId`;

  try {
    await connectToDatabase();

    const updtBalance = { balance: prm.finalAmt };

    const updCashflow = await Cashflow.findOneAndUpdate(
      { _id: prm.cashflowId },
      { $set: updtBalance },
      { returnOriginal: false }
    );

    if (updCashflow) {
      await Cashflowhist.create({
        cashflowId: prm.cashflowId,
        purchase: prm.purchase,
        type: prm.type,
        ref: prm.ref,
        detail: prm.detail,
        date: Date.now(),
        amount: prm.amount,
      });
    }
  } catch (error) {
    return `error updateCashflow : ${error}`;
  }
};

export const addNewCashflowThenUpdate = async (prm: UpdtCashflowPrm) => {
  try {
    await connectToDatabase();

    const addCashflow = await Cashflow.create({
      branch: prm.branch,
      balance: 0,
    });

    if (addCashflow) {
      await updateCashflow({
        ...prm,
        cashflowId: addCashflow.id,
        amount: addCashflow.balance + prm.amount,
      });
    }
  } catch (error) {
    return `error addNewCashflowThenUpdate : ${error}`;
  }
};
