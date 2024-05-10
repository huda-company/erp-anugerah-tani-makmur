import { IBillDocFieldRequest, IBillDocForm } from "^/@types/models/billdoc";
import { IPurchaseForm } from "^/@types/models/purchase";
import { API_VERSION, BASE_URL } from "^/config/env";
import { buildReqHeader, buildReqHeaderFData } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

const BASE_BILLDOC_API_URL = `${BASE_URL}/api/${API_VERSION}/billdoc`;

export const getBilldocAPI = async (
  sess: Session | null,
  params: Omit<IBillDocFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${BASE_BILLDOC_API_URL}?${qStr}`;

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

  const reqURL = `${BASE_BILLDOC_API_URL}/${params.id}`;

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

  const reqURL = `${BASE_BILLDOC_API_URL}/update/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteBranchAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${BASE_BILLDOC_API_URL}/delete/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
