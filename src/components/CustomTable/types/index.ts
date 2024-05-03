import { ReactNode } from "react";

export type CustomTblCols = {
  name: string;
  style?: string;
};

export type CustomTablItem = {
  value: string | ReactNode;
  className?: string;
  sort?: boolean;
  fontColor?: string;
};

export type CustomTblBody = {
  items: CustomTablItem[];
  style?: string;
};

export type CustomTblHeader = CustomTablItem[];

export type CustomTblData = {
  header: CustomTblHeader;
  body: CustomTblBody[];
};

export type CustomTblProps = {
  data: CustomTblData;
};
