import { IItemCatForm } from "^/@types/models/itemcategory";
import { ISupplierFieldRequest } from "^/@types/models/supplier";
import { API_VERSION, BASE_URL } from "^/config/env";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

const BASE_ITEM_CAT_API_URL = `${BASE_URL}/api/${API_VERSION}/item-category`;

export const getItemCatAPI = async (
  sess: Session | null,
  params: Omit<ISupplierFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${BASE_ITEM_CAT_API_URL}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const addItemCatAPI = async (
  sess: Session | null,
  params: IItemCatForm
) => {
  if (!sess) return null;

  const reqURL = `${BASE_ITEM_CAT_API_URL}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editItemCatAPI = async (
  sess: Session | null,
  params: IItemCatForm
) => {
  if (!sess) return null;

  const reqURL = `${BASE_ITEM_CAT_API_URL}/update/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteItemCateAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${BASE_ITEM_CAT_API_URL}/delete/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
