import { PO } from "@/constants/pageURL";
import { IPurchaseFieldRequest, IPurchaseForm } from "^/@types/models/purchase";
import { buildReqHeader } from "^/config/service";
import { handleAxiosError } from "^/utils/handleAxiosError";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getPurchaseAPI = async (
  sess: Session | null,
  params: Omit<IPurchaseFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${PO.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const createPurchaseAPI = async (
  sess: Session | null,
  params: IPurchaseForm
) => {
  if (!sess) return null;

  const reqURL = `${PO.API.ROOT}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    handleAxiosError(error);
  }
};

export const editPurchaseAPI = async (
  sess: Session | null,
  params: IPurchaseForm
) => {
  if (!sess) return null;

  const reqURL = `${PO.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    handleAxiosError(error);
  }
};

export const deletePurchaseAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${PO.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const apprPurchaseAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${PO.API.APPROVE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL);
  } catch (error: any) {
    handleAxiosError(error);
  }
};
