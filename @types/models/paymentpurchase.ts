import { Types } from "mongoose";
import { BaseFormProps, FormMode } from "../global";

export interface IPaymentPurchaseDocument extends Document {
  purchase: Types.ObjectId;
  poNo: string;
  billingCode: string;
  number: number;
  recurring: string;
  amount: number;
  paymentMode: Types.ObjectId;
  date: Date;
  ref: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  removed: boolean;
}

export interface IPaymentPurchaseFieldRequest {
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
    "sort[key]"?: IPaymentPurchaseFieldRequest["sort"]["key"];
    "sort[direction]"?: IPaymentPurchaseFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IPaymentPurchaseForm = {
  id?: string;
  name: string;
  city: string;
  address: string;
  description: string;
};

export type PaymentPurchaseFormProps = {
  mode: FormMode;
  initialFormVals: IPaymentPurchaseForm;
  doRefresh: () => void;
} & BaseFormProps;
