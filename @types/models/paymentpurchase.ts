import { Types } from "mongoose";
import { BaseFormProps, FormMode } from "../global";

export interface IPaymentPurchaseDocument extends Document {
  purchase: Types.ObjectId;
  amount: number;
  paymentMode: Types.ObjectId;
  date: Date;
  ref: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  removed: string;
  removedBy: string;
}

export interface IPaymentPurchaseFieldRequest {
  sort: {
    key: "name";
    direction: string;
  };
  query: {
    name: string;
    id?: string;
    purchaseid?: string;
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
  amount: number;
  paymentMode: string;
  file?: File | undefined;
};

export type PaymentPurchaseFormProps = {
  mode: FormMode;
  initialFormVals: IPaymentPurchaseForm;
  doRefresh: () => void;
} & BaseFormProps;
