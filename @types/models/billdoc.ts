import { BaseFormProps, FormMode } from "../global";

export interface IBillDocDocument extends Document {
  purchase: string;
  fileName: string;
  title: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  removed: string;
  removedBy: string;
}

export interface IBillDocFieldRequest {
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
    "sort[key]"?: IBillDocFieldRequest["sort"]["key"];
    "sort[direction]"?: IBillDocFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  createdAt?: number;
  // Add other sorting options as needed
}

export type IBillDocForm = {
  id?: string;
  title: string;
  description: string;
  file: File;
};

export type BranchFormProps = {
  mode: FormMode;
  initialFormVals: IBillDocForm;
  doRefresh: () => void;
} & BaseFormProps;
