import { UNIT } from "@/constants/pageURL";
import { IUnitFieldRequest, IUnitForm } from "^/@types/models/unit";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getUnitAPI = async (
  sess: Session | null,
  params: Omit<IUnitFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${UNIT.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const addUnitAPI = async (sess: Session | null, params: IUnitForm) => {
  if (!sess) return null;

  const reqURL = `${UNIT.API.ROOT}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editUnitAPI = async (sess: Session | null, params: IUnitForm) => {
  if (!sess) return null;

  const reqURL = `${UNIT.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteUnitAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${UNIT.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
