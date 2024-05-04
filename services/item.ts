import { IItemFieldRequest, IItemForm } from "^/@types/models/item";
import { API_VERSION, BASE_URL } from "^/config/env";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

const BASE_ITEM_API_URL = `${BASE_URL}/api/${API_VERSION}/item`;

export const getItemAPI = async (
  sess: Session | null,
  params: Omit<IItemFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${BASE_ITEM_API_URL}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const addItemAPI = async (sess: Session | null, params: IItemForm) => {
  if (!sess) return null;

  const reqURL = `${BASE_ITEM_API_URL}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editItemAPI = async (sess: Session | null, params: IItemForm) => {
  if (!sess) return null;

  const reqURL = `${BASE_ITEM_API_URL}/update/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteItemAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${BASE_ITEM_API_URL}/delete/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
