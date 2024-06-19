import { BranchResp } from "./branch";
import { CashflowActTypes } from "./cashflowhist";

export interface ICashflowDocument extends Document {
  branch: string;
  balance: number;
  date: Date;
  removed: string;
  removedBy: string;
  enabled: boolean;
}

export interface ICashflowFieldRequest {
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
    "sort[key]"?: ICashflowFieldRequest["sort"]["key"];
    "sort[direction]"?: ICashflowFieldRequest["sort"]["direction"];
  };
}

export type ICashflowGetReq = Omit<ICashflowFieldRequest["query"], "name">;

export interface ISortOptions {
  name?: string;
  // Add other sorting options as needed
}

export type CashflowResp = Pick<ICashflowDocument, "balance"> & {
  id?: string;
  branch: BranchResp;
};

export type CashflowTanTblData = Pick<ICashflowDocument, "balance"> & {
  id?: string;
  branchName: string;
  balance: number;
};

export interface AdjustCashflowPrm {
  branch: string;
  purchase: string;
  type: CashflowActTypes;
  ref?: string;
  detail?: string;
  amount: number;
}

export type UpdtCashflowPrm = {
  cashflowId: string;
  finalAmt: number;
} & AdjustCashflowPrm;
