import { BaseFormProps, FormMode } from "../global";

export interface IBranchDocument extends Document {
  name: string;
  address: string;
  city: string;
  description: string;
  removed: boolean;
  enabled: boolean;
}

export interface IBranchFieldRequest {
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
    "sort[key]"?: IBranchFieldRequest["sort"]["key"];
    "sort[direction]"?: IBranchFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IBranchForm = {
  id?: string;
  name: string;
  city: string;
  address: string;
  description: string;
};

export type BranchFormProps = {
  mode: FormMode;
  initialFormVals: IBranchForm;
  doRefresh: () => void;
} & BaseFormProps;
