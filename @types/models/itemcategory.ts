import { BaseFormProps, FormMode } from "../global";

export interface IItemCategoryDocument extends Document {
  name: string;
  description: string;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface IItemCatFieldRequest {
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
    "sort[key]"?: IItemCatFieldRequest["sort"]["key"];
    "sort[direction]"?: IItemCatFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IItemCatForm = {
  id?: string;
  name: string;
  description: string;
};

export type ItemCatFormProps = {
  mode: FormMode;
  initialFormVals: IItemCatForm;
  doRefresh: () => void;
} & BaseFormProps;
