import { Types } from "mongoose";
import { BaseFormProps, FormMode } from "../global";
import { PurchItem } from "./purchase";
import { IPickupDocDocument } from "./pickupdoc";
import { IItemDocument } from "./item";

export type PaymPurchItem = Omit<PurchItem, "discount">;

export interface IPaymentPurchaseDocument extends Document {
  purchase: Types.ObjectId;
  items: PaymPurchItem[];
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

export type IPaymPurchGetReq = Omit<
  IPaymentPurchaseFieldRequest["query"],
  "name"
>;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IPaymentPurchaseForm = Pick<
  IPaymentPurchaseDocument,
  "items" | "amount" | "date" | "ref" | "description"
> & {
  id?: string;
  file?: File | undefined;
  paymentMode: string;
  purchase: string;
};

export type PaymentPurchaseFormProps = {
  mode: FormMode;
  initialFormVals: IPaymentPurchaseForm;
  doRefresh: () => void;
} & BaseFormProps;

export interface FormattedPaymentPurchForm {
  item: string;
  quantity: string;
  unit: string;
  price: string;
  total: string;
}

export type PaymPurchItemObj = Pick<IItemDocument, "name" | "description"> & {
  _id?: string;
};

export type PaymPurchItemResp = {
  _id?: string;
  item: PaymPurchItemObj;
} & PaymPurchItem;

export type PaymentPurchaseResp = Omit<IPaymentPurchaseDocument, "items"> & {
  _id?: string;
  items: PaymPurchItemResp[];
  pickupDocs: Pick<
    IPickupDocDocument,
    "code" | "type" | "note" | "vehicleType" | "driverName"
  > & {
    _id?: string;
  };
};
