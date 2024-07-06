import { SUPP_STOCK_HIST } from "@/constants/pageURL";
import { ISupplierFieldRequest } from "^/@types/models/supplier";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getSupplierStockHistAPI = async (
  sess: Session | null,
  params: Omit<ISupplierFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${SUPP_STOCK_HIST.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};
