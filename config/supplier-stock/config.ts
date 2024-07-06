import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { pageRowsArr } from "../request/config";
import { ISupplierStockHistGetReq } from "^/@types/models/supplierstockhist";
import { ISupplierStockGetReq } from "^/@types/models/supplierstock";
import { SUPP_STOCK_HIST, SUPPLIER } from "@/constants/pageURL";

export const bcData: BreadcrumbItem[] = [
  {
    isActive: false,
    key: "purchase",
    name: "purchase",
    url: "",
  },
  {
    isActive: true,
    key: "supplierStock",
    name: "supplier Stock",
    url: SUPPLIER.PAGE.ROOT,
  },
];

export const bcDataSuppStockHist: BreadcrumbItem[] = [
  {
    isActive: false,
    key: "purchase",
    name: "purchase",
    url: "",
  },
  {
    isActive: true,
    key: "supplierStockHist",
    name: "supplier Stock History",
    url: SUPP_STOCK_HIST.PAGE.ROOT,
  },
];

export const initSuppStockReqPrm: ISupplierStockGetReq = {
  "param[search]": "",
  "sort[direction]": "asc",
  "sort[key]": "name",
  id: "",
  limit: pageRowsArr[0],
  page: 0,
};

export const initSuppStockHistReqPrm: ISupplierStockHistGetReq = {
  "param[search]": "",
  "sort[direction]": "asc",
  "sort[key]": "name",
  id: "",
  limit: pageRowsArr[0],
  page: 0,
};
