import { Types } from "mongoose";
import { PurchaseResp } from "./purchase";
import { CashflowResp } from "./cashflow";

export enum CashflowActTypes {
  PURCHASE_PAYMENT_ADD = "PURCHASE_PAYMENT_ADD",
  PURCHASE_PAYMENT_DEL = "PURCHASE_PAYMENT_DEL",
}

export interface ICashflowHistDocument extends Document {
  cashflowId: Types.ObjectId;
  purchase?: Types.ObjectId;
  date: Date;
  type: string;
  ref: string;
  detail: string;
  amount: number;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface ICashflowHistFieldRequest {
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
    "param[cashflowId]"?: string;
    "sort[key]"?: ICashflowHistFieldRequest["sort"]["key"];
    "sort[direction]"?: ICashflowHistFieldRequest["sort"]["direction"];
  };
}

export type ICashflowHistGetReq = Omit<
  ICashflowHistFieldRequest["query"],
  "name"
>;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type ICashflowHistFltrForm = {
  id?: string;
  supplier: string;
  item: string;
};

export type CashflowHistResp = Pick<
  ICashflowHistDocument,
  "date" | "detail" | "amount" | "type" | "ref" | "removedBy" | "enabled"
> & {
  id?: string;
  cashflowId: CashflowResp;
  purchase: PurchaseResp;
};

export type CashflowHistTanTblData = Pick<
  ICashflowHistDocument,
  "amount" | "type" | "ref"
> & {
  id?: string;
  date: string;
  poNo?: string;
  poId?: string;
  cashflowId: CashflowResp;
};
