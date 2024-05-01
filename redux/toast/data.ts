import type { Toast } from "./models";

const initialToast: Toast = {
  show: false,
  msg: "",
  type: "normal",
};

export const initialState: any = {
  obj: initialToast,
};
