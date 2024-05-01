import { initialState } from "./data";
import { RootState } from "../store";

const sidebar = (state: RootState) =>
  state.utils.sidebar || initialState.sidebar;

const selectors = {
  sidebar,
};

export default selectors;
