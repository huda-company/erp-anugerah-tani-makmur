import { PaginationCustomProp } from "@/components/PaginationCustom/types";
import { BaseFormProps, FormMode } from "../global";

export interface IBranchDocument extends Document {
  name: string;
  address: string;
  city: string;
  description: string;
  removed: string;
  removedBy: string;
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
    "param[search]"?: string;
    "sort[key]"?: IBranchFieldRequest["sort"]["key"];
    "sort[direction]"?: IBranchFieldRequest["sort"]["direction"];
  };
}

export type IBranchGetReq = Omit<IBranchFieldRequest["query"], "name"> &
  Pick<PaginationCustomProp, "nextPage" | "prevPage" | "totalPages">;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type IBranchForm = Pick<
  IBranchDocument,
  "name" | "address" | "city" | "description"
> & { id?: string };

export type BranchResp = Pick<
  IBranchDocument,
  | "name"
  | "address"
  | "city"
  | "description"
  | "removed"
  | "removedBy"
  | "enabled"
> & { id?: string };

export type BranchFormProps = {
  mode: FormMode;
  initialFormVals: IBranchForm;
  doRefresh: () => void;
} & BaseFormProps;
