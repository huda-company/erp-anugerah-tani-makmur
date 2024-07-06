import { BILL_DOC } from "@/constants/pageURL";
import { IBillDocFieldRequest, IBillDocForm } from "^/@types/models/billdoc";
import { IPurchaseForm } from "^/@types/models/purchase";
import { buildReqHeader, buildReqHeaderFData } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getBilldocAPI = async (
  sess: Session | null,
  params: Omit<IBillDocFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${BILL_DOC.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const createBilldocAPI = async (
  sess: Session | null,
  params: IBillDocForm
) => {
  if (!sess) return null;

  const reqURL = `${BILL_DOC.API.ROOT}/${params.id}`;

  const reqHeader = buildReqHeaderFData(String(sess.accessToken));

  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("title", params.title);
  formData.append("description", params.description);

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editPurchaseAPI = async (
  sess: Session | null,
  params: IPurchaseForm
) => {
  if (!sess) return null;

  const reqURL = `${BILL_DOC.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteBranchAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${BILL_DOC.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
