import { Types } from "mongoose";
import { BaseFormProps } from "../global";
import { ItemCatResp } from "./itemcategory";
import { PaginationCustomProp } from "@/components/PaginationCustom/types";

export interface IItemDocument extends Document {
  itemCategory: Types.ObjectId;
  name: string;
  description: string;
  brand: string;
  packaging: string;
  price?: number;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface IItemFieldRequest {
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
    "sort[key]"?: IItemFieldRequest["sort"]["key"];
    "sort[direction]"?: IItemFieldRequest["sort"]["direction"];
  };
}

// export type IItemGetReq = IItemFieldRequest["query"];
export type IItemGetReq = Omit<IItemFieldRequest["query"], "name"> &
  Pick<PaginationCustomProp, "nextPage" | "prevPage" | "totalPages">;

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

export type ItemResp = Pick<
  IItemDocument,
  | "name"
  | "price"
  | "brand"
  | "packaging"
  | "description"
  | "removed"
  | "removedBy"
  | "enabled"
> & {
  id?: string;
  itemCategory: ItemCatResp;
};

export type ItemTanTblData = Pick<
  IItemDocument,
  | "name"
  | "brand"
  | "packaging"
  | "description"
  | "removed"
  | "removedBy"
  | "enabled"
> & {
  id?: string;
  itemCategoryName: string;
};
