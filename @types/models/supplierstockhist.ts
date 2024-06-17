import { Types } from "mongoose";
import { SuppStockResp } from "./supplierstock";
import { PurchaseResp } from "./purchase";

export enum SuppStockTypes {
  APPROVED_PO = "APPROVED_PO",
  PURCHASE_PAYMENT_ADD = "PURCHASE_PAYMENT_ADD",
  PURCHASE_PAYMENT_DEL = "PURCHASE_PAYMENT_DEL",
}

export interface ISupplierStockHistDocument extends Document {
  suppStockId: Types.ObjectId;
  purchase?: Types.ObjectId;
  type: string;
  ref: string;
  detail: string;
  number: number;
  removed: string;
  removedBy: string;
  enabled: boolean;
  date: Date;
}

export interface ISupplierStockHistFieldRequest {
  sort: {
    key: "name";
    direction: string;
  };
  query: {
    name: string;
    id?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    startDate?: Date;
    endDate?: Date;
    "param[search]"?: string;
    "param[suppStockId]"?: string;
    "sort[key]"?: ISupplierStockHistFieldRequest["sort"]["key"];
    "sort[direction]"?: ISupplierStockHistFieldRequest["sort"]["direction"];
  };
}

export type ISupplierStockHistGetReq = Omit<
  ISupplierStockHistFieldRequest["query"],
  "name"
>;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type ISuppStockHistFltrForm = {
  id?: string;
  supplier: string;
  item: string;
};

export type SuppStockHistResp = Pick<
  ISupplierStockHistDocument,
  "date" | "detail" | "number" | "type" | "ref" | "removedBy" | "enabled"
> & {
  id?: string;
  suppStockId: SuppStockResp;
  purchase: PurchaseResp;
};

export type SuppStockHistTanTblData = Pick<
  ISupplierStockHistDocument,
  "number" | "type" | "ref"
> & {
  id?: string;
  date: string;
  poNo?: string;
  poId?: string;
  suppStockId: SuppStockResp;
};
