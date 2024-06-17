import { Types } from "mongoose";
import { BaseFormProps } from "../global";
import { SuppStockTypes } from "./supplierstockhist";
import { ItemResp } from "./item";
import { SupplierResp } from "./supplier";

export interface ISupplierStockDocument extends Document {
  item: Types.ObjectId;
  supplier: string;
  stock: number;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface ISuppStockFieldRequest {
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
    "sort[key]"?: ISuppStockFieldRequest["sort"]["key"];
    "sort[direction]"?: ISuppStockFieldRequest["sort"]["direction"];
  };
}

export type ISupplierStockGetReq = Omit<
  ISuppStockFieldRequest["query"],
  "name"
>;

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

export type SuppStockResp = Pick<ISupplierStockDocument, "stock"> & {
  id?: string;
  item: ItemResp;
  supplier: SupplierResp;
};

export type SuppStockTanTblData = Pick<ISupplierStockDocument, "stock"> & {
  id?: string;
  itemName: string;
  suppName: string;
};

export interface AdjustSuppStockPrm {
  item: string;
  supplier: string;
  purchase: string;
  type: SuppStockTypes;
  ref?: string;
  detail?: string;
  qty: number;
}

export type UpdtSuppStockPrm = {
  suppStockId: string;
  finalQty: number;
} & AdjustSuppStockPrm;
