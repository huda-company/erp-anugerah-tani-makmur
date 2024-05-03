import { ReactNode } from "react";

export type CustomTblCols = {
  name: string;
  style?: string;
};

export type CustomTblItem = {
  value: string | ReactNode;
  className?: string;
  sort?: boolean;
  fontColor?: string;
};

export type CustomTblBody = {
  items: CustomTblItem[];
  style?: string;
};

export type CustomTblHeader = CustomTblItem[];

export type CustomTblData = {
  header: CustomTblHeader;
  body: CustomTblBody[];
};

export type CustomTblProps = {
  data: CustomTblData;
};
