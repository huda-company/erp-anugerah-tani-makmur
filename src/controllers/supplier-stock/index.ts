import { ISortOptions } from "^/@types/models/supplier";
import connectToDatabase from "^/mongodb/connDb";
import { NextApiRequest, NextApiResponse } from "next";
import { onSupplierStockFilter } from "./config/filter";
import { MONGODB } from "^/config/mongodb";
import { respBody } from "^/config/serverResponse";
import { pageRowsArr } from "^/config/request/config";
import Supplierstock from "^/mongodb/schemas/supplierstock";
import { onItemFilter } from "../item/config/filter";
import Item from "^/mongodb/schemas/item";
import { onSupplierFilter } from "../supplier/config/filter";
import Supplier from "^/mongodb/schemas/supplier";

export const getSupplierStock = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { page, limit } = req.query;

  try {
    await connectToDatabase();

    const sortOptions: ISortOptions = {}; // Define an empty object for sort options
    let newQuery = req.query;

    const itemFilter: any = onItemFilter(req.query as any);
    const items = await Item.find(itemFilter);
    if (items) {
      newQuery = {
        ...newQuery,
        ["param[item]"]: items.map((item) => item.id),
      };
    }

    const suppFilter: any = onSupplierFilter(req.query as any);
    const suppliers = await Supplier.find(suppFilter);
    if (suppliers) {
      newQuery = {
        ...newQuery,
        ["param[supplier]"]: suppliers.map((supp) => supp.id),
      };
    }

    const filter: any = onSupplierStockFilter(newQuery as any);

    const suppStocks = await Supplierstock.paginate(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || pageRowsArr[0],
      customLabels: MONGODB.PAGINATION_LABEL,
      sort: sortOptions,
    });

    return res
      .status(200)
      .json({ ...respBody.SUCCESS.RETRIEVED_DATA_SUCCESS, data: suppStocks });
  } catch (error) {
    return res.status(500).json({
      ...respBody.ERROR.UNEXPECTED_ERROR,
      error: `getSupplierStock : ${error}`,
    });
  }
};
