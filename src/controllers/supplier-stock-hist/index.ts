import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { onSuppStockHistFilter } from "./config/filter";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { pageRowsArr } from "^/config/request/config";
import Supplierstockhist from "^/mongodb/schemas/supplierstockhist";

export const getSupplierStockHist = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  try {
    await connectToDatabase();

    const sortOptions: ISortOptions = {}; // Define an empty object for sort options

    const filter: any = onSuppStockHistFilter(req.query as any);

    const suppStockHists = await Supplierstockhist.paginate(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || pageRowsArr[0],
      customLabels: MONGODB.PAGINATION_LABEL,
      sort: sortOptions,
    });

    return res
      .status(200)
      .json({
        ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS,
        data: suppStockHists,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        ...respBody.ERROR.UNEXPECTED_ERROR,
        error: `getSupplierStock : ${error}`,
      });
  }

  await connectToDatabase();
};
