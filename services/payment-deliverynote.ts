import { DELIV_NOTE_PAYMENT } from "@/constants/pageURL";
import { IDelivNoteGetReq } from "^/@types/models/deliverynote";
import { IPaymentDelivNoteForm } from "^/@types/models/paymentdelivnote";
import { formatPurchaseData } from "^/config/payment-purchase/config";
import { buildReqHeader, buildReqHeaderFData } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getDelivNotePaymAPI = async (
  sess: Session | null,
  params: IDelivNoteGetReq
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${DELIV_NOTE_PAYMENT.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const createPaymentDelivNoteAPI = async (
  sess: Session | null,
  params: IPaymentDelivNoteForm
) => {
  if (!sess) return null;

  const reqURL = `${DELIV_NOTE_PAYMENT.API.ROOT}/${params.id}`;

  const reqHeader = buildReqHeaderFData(String(sess.accessToken));

  const convertedPurchData = await formatPurchaseData(params);

  const formData = new FormData();
  // formData.append("file", params.file);
  formData.append("item", convertedPurchData.item);
  formData.append("price", convertedPurchData.price);
  formData.append("unit", convertedPurchData.unit);
  formData.append("quantity", convertedPurchData.quantity);
  formData.append("total", convertedPurchData.total);
  formData.append("description", String(params.description));
  formData.append("date", String(params.date));
  formData.append("amount", String(params.amount));
  formData.append("paymentMode", String(params.paymentMode));

  try {
    return await axios.create(reqHeader).post(reqURL, formData);
  } catch (error: any) {
    return error;
  }
};
