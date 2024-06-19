import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { pageRowsArr } from "^/config/request/config";
import { onCashFlowHistFilter } from "./config/filter";
import Cashflowhist from "^/mongodb/schemas/cashflowhist";

export const getCashFlowHist = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  try {
    await connectToDatabase();

    const sortOptions: ISortOptions = {}; // Define an empty object for sort options

    const filter: any = onCashFlowHistFilter(req.query as any);

    const stockHists = await Cashflowhist.paginate(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || pageRowsArr[0],
      customLabels: MONGODB.PAGINATION_LABEL,
      sort: sortOptions,
    });

    return res.status(200).json({
      ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS,
      data: stockHists,
    });
  } catch (error) {
    return res.status(500).json({
      ...respBody.ERROR.UNEXPECTED_ERROR,
      error: `getStockHist : ${error}`,
    });
  }

  await connectToDatabase();
};
