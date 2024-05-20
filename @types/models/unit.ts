import { BaseFormProps, FormMode } from "../global";

export interface IUnitDocument extends Document {
  name: string;
  description: string;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface IUnitFieldRequest {
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
    "sort[key]"?: IUnitFieldRequest["sort"]["key"];
    "sort[direction]"?: IUnitFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IUnitForm = Pick<IUnitDocument, "name" | "description"> & {
  id?: string;
};

export type UnitResp = Pick<
  IUnitDocument,
  "name" | "description" | "removed" | "removedBy" | "enabled"
> & { id?: string };

export type UnitFormProps = {
  mode: FormMode;
  initialFormVals: IUnitForm;
  doRefresh: () => void;
} & BaseFormProps;
