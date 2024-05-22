import { BaseFormProps } from "../global";

export interface ISupplierDocument extends Document {
  email: string;
  supplierCode: string;
  company: string;
  managerName: string;
  managerSurname: string;
  bankAccount: string;
  RC: string;
  AI: string;
  NIF: string;
  NIS: string;
  address: string;
  tel: string;
  fax: string;
  cell: string;
  website: string;
  createdAt: Date;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface ISupplierFieldRequest {
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
    "sort[key]"?: ISupplierFieldRequest["sort"]["key"];
    "sort[direction]"?: ISupplierFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  createdAt?: number;
  // Add other sorting options as needed
}

export type ISupplierForm = Pick<
  ISupplierDocument,
  | "company"
  | "address"
  | "bankAccount"
  | "email"
  | "managerName"
  | "managerSurname"
  | "tel"
> & { id?: string };

export type SupplierFormProps = {
  initialFormVals: ISupplierForm;
} & BaseFormProps;

export type SupplierTanTblData = {
  supplierCode: string;
} & ISupplierForm;

export type SupplierResp = {
  id: string;
} & SupplierTanTblData;
