import { Types } from "mongoose";
import { BaseFormProps, FormMode } from "../global";
import { PurchaseResp } from "./purchase";
import { PaymentPurchaseResp } from "./paymentpurchase";

export interface IDelivNoteDocument extends Document {
  paymentPurchase: Types.ObjectId;
  purchase: Types.ObjectId;
  code: string;
  item?: Types.ObjectId;
  supplier: Types.ObjectId;
  unit: Types.ObjectId;
  quantity: number;
  note: string;
  vehicleType: string;
  flatNo: string;
  driverName: string;
  driverLicenseNo: string;
  doTotal: number;
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

export type IPickupDocForm = Pick<
  IDelivNoteDocument,
  "driverName" | "vehicleType" | "note" | "flatNo" | "description"
> & {
  id?: string;
  doTotal?: number;
  branch?: string;
  // file?: File | undefined;
};

export type PickupDocFormProps = {
  mode: FormMode;
  initialFormVals: IPickupDocForm;
  onclose: () => void;
  onSubmitOk: () => void;
} & BaseFormProps;

export type PickupDocResp = Omit<IDelivNoteDocument, "items" | "supplier"> & {
  id?: string;
  purchase: PurchaseResp;
  paymentPurchase: PaymentPurchaseResp;
};
