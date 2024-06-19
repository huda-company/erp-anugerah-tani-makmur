import { IStockGetReq } from "^/@types/models/stock";
import { API_VERSION, BASE_URL } from "^/config/env";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

const BASE_STOCK_HIST_API_URL = `${BASE_URL}/api/${API_VERSION}/stock-hist`;

export const getStockHistAPI = async (
  sess: Session | null,
  params: IStockGetReq
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${BASE_STOCK_HIST_API_URL}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};
