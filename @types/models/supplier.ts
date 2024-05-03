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
  removed: boolean;
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
    "sort[key]"?: ISupplierFieldRequest["sort"]["key"];
    "sort[direction]"?: ISupplierFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type ISupplierForm = {
  id?: string;
  company: string;
  address: string;
  bankAccount: string;
  email: string;
  managerName: string;
  managerSurname: string;
  tel: string;
};

export enum FormMode {
  ADD = "ADD",
  VIEW = "VIEW",
  EDIT = "EDIT",
}

export type SupplierFormProps = {
  mode: FormMode;
  initialFormVals: ISupplierForm;
  doRefresh: () => void;
};
