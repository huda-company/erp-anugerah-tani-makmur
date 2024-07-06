import { ITEM_CAT } from "@/constants/pageURL";
import { IItemCatForm } from "^/@types/models/itemcategory";
import { ISupplierFieldRequest } from "^/@types/models/supplier";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getItemCatAPI = async (
  sess: Session | null,
  params: Omit<ISupplierFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${ITEM_CAT.API.ROOT}?${qStr}`;

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

  const reqURL = `${ITEM_CAT.API.ROOT}`;

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

  const reqURL = `${ITEM_CAT.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteItemCatAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${ITEM_CAT.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
