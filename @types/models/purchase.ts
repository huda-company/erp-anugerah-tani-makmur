import { BaseFormProps, FormMode } from "../global";

export type PurchItem = {
  item: string;
  unit: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
};

export interface BasePurchase {
  poNo: string;
  billingCode: string;
  soNumber: string;
  number: number;
  recurring: string;
  year: number;
  date: Date;
  expDate: Date;
  supplier: string;
  ppnIncluded: boolean;
  subTotal: number;
  taxRate: number;
  taxTotal: number;
  grandTotal: number;
  credit: number;
  discount: number;
  paymentPurchase: string;
  paymentStatus: string;
  purchPaymentMethod: string;
  note: string;
  status: string;
  pdfPath: string;
  items: PurchItem[];
}

export interface IPurchaseDocument extends BasePurchase, Document {
  updatedAt: Date;
  createdAt: Date;
  removed: string;
  removedBy: string;
}

export interface IPurchaseFieldRequest {
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
    "sort[key]"?: IPurchaseFieldRequest["sort"]["key"];
    "sort[direction]"?: IPurchaseFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IPurchaseForm = {
  id?: string;
  name: string;
} & BasePurchase;

export type PurchaseFormProps = {
  mode: FormMode;
  initialFormVals: IPurchaseForm;
  doRefresh: () => void;
} & BaseFormProps;
