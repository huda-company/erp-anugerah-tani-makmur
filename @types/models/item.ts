import { Types } from "mongoose";
import { BaseFormProps } from "../global";

export interface IItemDocument extends Document {
  itemCategory: Types.ObjectId;
  name: string;
  description: string;
  brand: string;
  packaging: string;
  price: number;
  removed: boolean;
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
    "sort[key]"?: IItemFieldRequest["sort"]["key"];
    "sort[direction]"?: IItemFieldRequest["sort"]["direction"];
  };
}

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
