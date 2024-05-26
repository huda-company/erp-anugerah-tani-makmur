import { IPaymentPurchaseFieldRequest } from "^/@types/models/paymentpurchase";
import { IPickupDocForm } from "^/@types/models/pickupdoc";
import { API_VERSION, BASE_URL } from "^/config/env";
import { buildReqHeader, buildReqHeaderFData } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

const BASE_PICKUP_DOC_API_URL = `${BASE_URL}/api/${API_VERSION}/pickup-doc`;

export const getPickupDocAPI = async (
  sess: Session | null,
  params: Omit<IPaymentPurchaseFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${BASE_PICKUP_DOC_API_URL}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const createPickupDocAPI = async (
  sess: Session | null,
  params: IPickupDocForm
) => {
  if (!sess) return null;

  const reqURL = `${BASE_PICKUP_DOC_API_URL}/${params.id}`;

  const reqHeader = buildReqHeaderFData(String(sess.accessToken));

  const formData = new FormData();
  // formData.append("file", params.file);
  formData.append("vehicleType", String(params.vehicleType));
  formData.append("flatNo", String(params.flatNo));
  formData.append("driverName", String(params.driverName));
  formData.append("note", String(params.note));
  formData.append("description", String(params.description));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editPickupDocAPI = async (
  sess: Session | null,
  params: IPickupDocForm
) => {
  if (!sess) return null;

  const reqURL = `${BASE_PICKUP_DOC_API_URL}/update/${params.id}`;

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

  const reqURL = `${BASE_PICKUP_DOC_API_URL}/delete/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
