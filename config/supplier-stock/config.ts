import { BreadcrumbItem } from "@/components/CustomBreadcrumb/types";
import { SUPPLIER_PAGE, SUPPLIER_STOCK_HIST_PAGE } from "@/constants/pageURL";
import { pageRowsArr } from "../request/config";
import { ISupplierStockHistGetReq } from "^/@types/models/supplierstockhist";
import { ISupplierStockGetReq } from "^/@types/models/supplierstock";

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
    url: SUPPLIER_PAGE.ROOT,
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
    url: SUPPLIER_STOCK_HIST_PAGE.ROOT,
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
