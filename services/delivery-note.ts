import { DELIV_NOTE } from "@/constants/pageURL";
import { IDelivNoteForm, IDelivNoteGetReq } from "^/@types/models/deliverynote";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getDelivNoteAPI = async (
  sess: Session | null,
  params: IDelivNoteGetReq
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${DELIV_NOTE.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const createDelivNoteAPI = async (
  sess: Session | null,
  params: IDelivNoteForm
) => {
  if (!sess) return null;

  const reqURL = `${DELIV_NOTE.API.ROOT}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editDelivNoteAPI = async (
  sess: Session | null,
  params: IDelivNoteForm
) => {
  if (!sess) return null;

  const reqURL = `${DELIV_NOTE.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteSupplierAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${DELIV_NOTE.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
