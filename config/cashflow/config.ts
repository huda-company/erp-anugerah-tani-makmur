import { ICashflowGetReq } from "^/@types/models/cashflow";
import { pageRowsArr } from "../request/config";

export const initCflReqPrm: ICashflowGetReq = {
  "param[search]": "",
  "sort[direction]": "asc",
  "sort[key]": "name",
  id: "",
  limit: pageRowsArr[0],
  page: 0,
  prevPage: null,
  nextPage: null,
  totalPages: 0,
};
