import { initialState } from "./data";
import { RootState } from "../store";

const toast = (state: RootState) => state.toast.obj || initialState;

const selectors = {
  toast,
};

export default selectors;
