import { ReactNode } from "react";

export type AlertModalProps = {
  open: boolean;
  title: string;
  content: string | ReactNode;
  success?: boolean;
  className?: string;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onClose?: (param: any) => void;
};
