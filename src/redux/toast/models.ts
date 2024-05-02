import { ReactNode } from "react";

export type Toast = {
  timeout?: number;
  show: boolean;
  msg: string | ReactNode;
  type: string;
};
