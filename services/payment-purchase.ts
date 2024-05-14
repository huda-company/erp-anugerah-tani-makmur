import {
  IPaymentPurchaseFieldRequest,
  IPaymentPurchaseForm,
} from "^/@types/models/paymentpurchase";
import { IPurchaseForm } from "^/@types/models/purchase";
import { API_VERSION, BASE_URL } from "^/config/env";
import { buildReqHeader, buildReqHeaderFData } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

const BASE_PAYM_PURCHASE_API_URL = `${BASE_URL}/api/${API_VERSION}/payment-purchase`;

export const getPaymentPurchaseAPI = async (
  sess: Session | null,
  params: Omit<IPaymentPurchaseFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${BASE_PAYM_PURCHASE_API_URL}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const createPaymentPurchaseAPI = async (
  sess: Session | null,
  params: IPaymentPurchaseForm
) => {
  if (!sess) return null;

  const reqURL = `${BASE_PAYM_PURCHASE_API_URL}/${params.id}`;

  const reqHeader = buildReqHeaderFData(String(sess.accessToken));

  const formData = new FormData();
  // formData.append("file", params.file);
  formData.append("amount", String(params.amount));
  formData.append("paymentMode", params.paymentMode);

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editPaymentPurchaseAPI = async (
  sess: Session | null,
  params: IPurchaseForm
) => {
  if (!sess) return null;

  const reqURL = `${BASE_PAYM_PURCHASE_API_URL}/update/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deletePaymentPurchaseAPI = async (
  sess: Session | null,
  id: string
) => {
  if (!sess) return null;

  const reqURL = `${BASE_PAYM_PURCHASE_API_URL}/delete/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
