import { Types } from "mongoose";
import { BaseFormProps } from "../global";
import { ItemResp } from "./item";
import { BranchResp } from "./branch";
import { AdjustSuppStockPrm } from "./supplierstock";
import { StockActivityTypes } from "./stockhist";

export interface IStockDocument extends Document {
  item: Types.ObjectId;
  branch: string;
  stock: number;
  date: Date;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface IStockFieldRequest {
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
    "sort[key]"?: IStockFieldRequest["sort"]["key"];
    "sort[direction]"?: IStockFieldRequest["sort"]["direction"];
  };
}

export type IStockGetReq = Omit<IStockFieldRequest["query"], "name">;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IItemForm = {
  id?: string;
  itemCategory: string;
  name: string;
  description: string;
  price: number;
};

export type ItemFormProps = {
  initialFormVals: IItemForm;
} & BaseFormProps;

export type StockResp = Pick<IStockDocument, "stock"> & {
  id?: string;
  item: ItemResp;
  branch: BranchResp;
};

export type StockTanTblData = Pick<IStockDocument, "stock"> & {
  id?: string;
  itemName: string;
  branchName: string;
};

export type AdjustStockPrm = Omit<AdjustSuppStockPrm, "supplier" | "type"> & {
  type: StockActivityTypes;
  branch: string;
};

export type UpdtStockPrm = {
  stockId: string;
  finalQty: number;
} & AdjustStockPrm;
