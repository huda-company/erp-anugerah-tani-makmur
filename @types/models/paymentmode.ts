import { BaseFormProps, FormMode } from "../global";

export interface IPaymentModeDocument extends Document {
  description: string;
  name: string;
  createdAt: Date;
  enabled: boolean;
  isDefault: boolean;
  removed: boolean;
  ref: string;
}

export interface IPaymentModeFieldRequest {
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
    "sort[key]"?: IPaymentModeFieldRequest["sort"]["key"];
    "sort[direction]"?: IPaymentModeFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IPaymentModeForm = {
  id?: string;
  name: string;
  city: string;
  address: string;
  description: string;
};

export type PaymentModeFormProps = {
  mode: FormMode;
  initialFormVals: IPaymentModeForm;
  doRefresh: () => void;
} & BaseFormProps;
