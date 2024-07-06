import { Types } from "mongoose";
import { BaseFormProps, FormMode } from "../global";
import { PurchItem } from "./purchase";
import { IItemDocument } from "./item";
import { PaymentModeResp } from "./paymentmode";
import { DelivNoteResp } from "./deliverynote";

export type PaymPurchItem = Omit<PurchItem, "discount">;

export interface IPaymentDelivnoteDocument extends Document {
  delivnote: Types.ObjectId;
  items: PaymPurchItem[];
  amount: number;
  paymentMode: Types.ObjectId;
  date: Date;
  ref: string;
  status: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  removed: string;
  removedBy: string;
}

export interface IPaymentDelivNoteFieldRequest {
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
    "param[deliverynoteid]"?: string;
    "sort[key]"?: IPaymentDelivNoteFieldRequest["sort"]["key"];
    "sort[direction]"?: IPaymentDelivNoteFieldRequest["sort"]["direction"];
  };
}

export type IPaymDelivNoteGetReq = Omit<
  IPaymentDelivNoteFieldRequest["query"],
  "name"
>;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IPaymentDelivNoteForm = Pick<
  IPaymentDelivnoteDocument,
  "items" | "amount" | "date" | "ref" | "description"
> & {
  id?: string;
  file?: File | undefined;
  paymentMode: string;
  purchase: string;
};

export type PaymentDelivNoteFormProps = {
  mode: FormMode;
  initialFormVals: IPaymentDelivNoteForm;
  onclose: () => void;
  onSubmitOk: () => void;
  doRefresh: () => void;
} & BaseFormProps;

export interface FormattedPaymentPurchForm {
  item: string;
  quantity: string;
  unit: string;
  price: string;
  total: string;
}

export type PaymDelivNoteItemObj = Pick<
  IItemDocument,
  "name" | "description"
> & {
  _id?: string;
};

export type PaymDelivNoteItemResp = {
  _id?: string;
  item: PaymDelivNoteItemObj;
} & PaymPurchItem;

export type PaymentDelivnoteResp = Omit<IPaymentDelivnoteDocument, ""> & {
  _id?: string;
  delivnote: DelivNoteResp;
  paymentMode: PaymentModeResp;
};
