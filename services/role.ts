import { ROLE } from "@/constants/pageURL";
import { IRoleFieldRequest } from "^/@types/models/role";
import { IUserForm } from "^/@types/models/user";
import { buildReqHeader } from "^/config/service";
import { objToQueryURL } from "^/utils/helpers";
import axios from "axios";
import { Session } from "next-auth";

export const getRoleAPI = async (
  sess: Session | null,
  params: Omit<IRoleFieldRequest["query"], "name">
) => {
  if (!sess) return null;

  const qStr = objToQueryURL(params);
  const reqURL = `${ROLE.API.ROOT}?${qStr}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).get(reqURL);
  } catch (error: any) {
    return error;
  }
};

export const addUserAPI = async (sess: Session | null, params: IUserForm) => {
  if (!sess) return null;

  const reqURL = `${ROLE.API.ROOT}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).post(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const editUserAPI = async (sess: Session | null, params: IUserForm) => {
  if (!sess) return null;

  const reqURL = `${ROLE.API.EDIT}/${params.id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).patch(reqURL, params);
  } catch (error: any) {
    return error;
  }
};

export const deleteBranchAPI = async (sess: Session | null, id: string) => {
  if (!sess) return null;

  const reqURL = `${ROLE.API.DELETE}/${id}`;

  const reqHeader = buildReqHeader(String(sess.accessToken));

  try {
    return await axios.create(reqHeader).delete(reqURL);
  } catch (error: any) {
    return error;
  }
};
