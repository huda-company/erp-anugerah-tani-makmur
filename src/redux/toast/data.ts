import type { Toast } from "./models";

const initialToast: Toast = {
  show: false,
  msg: "",
  type: "success",
};

export const initialState: any = {
  obj: initialToast,
};
