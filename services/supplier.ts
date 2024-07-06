import { SUPPLIER } from "@/constants/pageURL";
import { ISupplierFieldRequest, ISupplierForm } from "^/@types/models/supplier";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getSupplierAPI = async (
  sess: Session | null,
  params: Omit<ISupplierFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${SUPPLIER.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const addSupplierAPI = async (
  sess: Session | null,
  params: ISupplierForm
) => {
  if (!sess) return null;

  const reqURL = `${SUPPLIER.API.ROOT}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editSupplierAPI = async (
  sess: Session | null,
  params: ISupplierForm
) => {
  if (!sess) return null;

  const reqURL = `${SUPPLIER.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteSupplierAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${SUPPLIER.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
