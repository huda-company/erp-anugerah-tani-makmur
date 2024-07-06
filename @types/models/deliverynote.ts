import { Types } from "mongoose";
import { BaseFormProps, FormMode } from "../global";
import { PurchItem, PurchaseResp } from "./purchase";
import { PaymentPurchaseResp } from "./paymentpurchase";
import { BranchResp } from "./branch";
import { ItemResp } from "./item";
import { PickupDocResp } from "./pickupdoc";

export enum CostTypes {
  FUEL = "FUEL",
  TOLL = "TOLL",
  SCALES = "SCALES",
  DRIVER_FEE = "DRIVER_FEE",
}

export type DelivnoteItem = PurchItem & { pickupdoc?: string };

export type CostItem = {
  type: CostTypes;
  amount: number;
};

export interface IDelivNoteDocument extends Document {
  paymentPurchase?: Types.ObjectId;
  purchase: Types.ObjectId;
  branch: Types.ObjectId;
  code: string;
  items: DelivnoteItem[];
  costItems: CostItem[];
  sellingTotal: number;
  purchaseTotal: number;
  quantity: number;
  note: string;
  vehicleType: string;
  flatNo: string;
  driverName: string;
  driverLicenseNo: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  removed: string;
  removedBy: string;
}

export interface IDelivNoteFieldRequest {
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
    "param[search]"?: string;
    "sort[key]"?: IDelivNoteFieldRequest["sort"]["key"];
    "sort[direction]"?: IDelivNoteFieldRequest["sort"]["direction"];
  };
}

export type IDelivNoteGetReq = Omit<IDelivNoteFieldRequest["query"], "name">;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type DelivNoteItem = {
  item: string;
  unit: string;
  quantity: number;
  price: number;
  discount: number;
  note: string;
  total: number;
};

export type IDelivNoteForm = Pick<
  IDelivNoteDocument,
  | "driverName"
  | "vehicleType"
  | "driverLicenseNo"
  | "note"
  | "flatNo"
  | "description"
  | "sellingTotal"
  | "purchaseTotal"
> & {
  id?: string;
  paymentPurchase?: string;
  code?: string;
  date?: string;
  doTotal?: number;
  branch?: string;
  soNumber?: string;
  items: DelivNoteItem[];
  costItems: CostItem[];
  // file?: File | undefined;
};

export type DelivNoteFormProps = {
  mode: FormMode;
  initialFormVals: IDelivNoteForm;
  onclose: () => void;
  onSubmitOk: () => void;
} & BaseFormProps;

export type DelivNoteItemResp = Omit<IDelivNoteDocument, "items"> & {
  item: ItemResp;
  pickupdoc?: PickupDocResp;
};

export type DelivNoteResp = Omit<IDelivNoteDocument, "items"> & {
  id?: string;
  purchase: PurchaseResp;
  paymentPurchase: PaymentPurchaseResp;
  branch: BranchResp;
  items: DelivNoteItemResp[];
};

export type DelivNoteTanTblData = Omit<
  DelivNoteResp,
  "branch" | "purchase" | "paymentPurchase" | "itemResp"
> & { id?: string; branchName: string };
