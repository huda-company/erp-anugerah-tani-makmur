import { combineReducers } from "@reduxjs/toolkit";

import { toastReducers } from "./toast/slices";
import { initialState as initialUtilsState } from "./utils/data";
import { utilsReducers } from "./utils/slices";

const appReducer = combineReducers({
  utils: utilsReducers,
  toast: toastReducers,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "utils/logout") {
    state.utils = initialUtilsState;
    return appReducer(state, action);
  }

  return appReducer(state, action);
};

export { rootReducer };
