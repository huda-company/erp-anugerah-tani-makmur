import { Types } from "mongoose";
import { SuppStockResp } from "./supplierstock";
import { PurchaseResp } from "./purchase";
import { PickupDocResp } from "./pickupdoc";

export enum StockActivityTypes {
  PURCHASE_PAYMENT_ADD = "PURCHASE_PAYMENT_ADD",
  PURCHASE_PAYMENT_DEL = "PURCHASE_PAYMENT_DEL",
}

export interface IStockHistDocument extends Document {
  stockId: Types.ObjectId;
  purchase?: Types.ObjectId;
  pickupDoc?: Types.ObjectId;
  date: Date;
  type: string;
  ref: string;
  detail: string;
  number: number;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface IStockHistFieldRequest {
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
    "param[stockId]"?: string;
    "sort[key]"?: IStockHistFieldRequest["sort"]["key"];
    "sort[direction]"?: IStockHistFieldRequest["sort"]["direction"];
  };
}

export type IStockHistGetReq = Omit<IStockHistFieldRequest["query"], "name">;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type ISuppStockHistFltrForm = {
  id?: string;
  supplier: string;
  item: string;
};

export type StockHistResp = Pick<
  IStockHistDocument,
  "date" | "detail" | "number" | "type" | "ref" | "removedBy" | "enabled"
> & {
  id?: string;
  stockId: SuppStockResp;
  purchase: PurchaseResp;
  pickupDoc: PickupDocResp;
};

export type StockHistTanTblData = Pick<
  IStockHistDocument,
  "number" | "type" | "ref"
> & {
  id?: string;
  date: string;
  poNo?: string;
  poId?: string;
  unit?: string;
  stockId: SuppStockResp;
};
