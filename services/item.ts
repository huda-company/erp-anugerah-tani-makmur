import { ITEM } from "@/constants/pageURL";
import { IItemFieldRequest, IItemForm } from "^/@types/models/item";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getItemAPI = async (
  sess: Session | null,
  params: Omit<IItemFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${ITEM.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const addItemAPI = async (sess: Session | null, params: IItemForm) => {
  if (!sess) return null;

  const reqURL = `${ITEM.API.ROOT}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editItemAPI = async (sess: Session | null, params: IItemForm) => {
  if (!sess) return null;

  const reqURL = `${ITEM.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteItemAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${ITEM.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
