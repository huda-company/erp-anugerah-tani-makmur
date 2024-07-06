import { PICKUP_DOC } from "@/constants/pageURL";
import { IPaymentPurchaseFieldRequest } from "^/@types/models/paymentpurchase";
import { IPickupDocForm } from "^/@types/models/pickupdoc";
import { buildReqHeader, buildReqHeaderFData } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getPickupDocAPI = async (
  sess: Session | null,
  params: Omit<IPaymentPurchaseFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${PICKUP_DOC.API.ROOT}?${qStr}`;

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

  const reqURL = `${PICKUP_DOC.API.ROOT}/${params.id}`;

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

  const reqURL = `${PICKUP_DOC.API.EDIT}/${params.id}`;

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

  const reqURL = `${PICKUP_DOC.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
