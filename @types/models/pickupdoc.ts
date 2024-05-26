import { Types } from "mongoose";
import { BaseFormProps, FormMode } from "../global";

export enum PickupDocType {
  SPAA = "SPAA",
  PPB = "PPB",
}

export interface IPickupDocDocument extends Document {
  paymentPurchase: Types.ObjectId;
  purchase: Types.ObjectId;
  type: PickupDocType;
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
  IPickupDocDocument,
  "type" | "driverName" | "vehicleType" | "note" | "flatNo" | "description"
> & {
  id?: string;
  doTotal?: number;
  // file?: File | undefined;
};

export type PickupDocFormProps = {
  mode: FormMode;
  initialFormVals: IPickupDocForm;
  onclose: () => void;
  onSubmitOk: () => void;
} & BaseFormProps;
