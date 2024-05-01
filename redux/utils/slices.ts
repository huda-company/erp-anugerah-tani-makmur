import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { initialState } from "./data";
import type { SidebarState } from "./models";
import { noop } from "^/utils/helpers";

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setSidebar: (state, { payload }: PayloadAction<SidebarState>) => {
      state.sidebar = { ...payload };
    },
    logout: () => {
      noop;
    },
    PURGE: (state) => {
      // eslint-disable-next-line  unused-imports/no-unused-vars
      state = initialState;
    },
  },
});

const { actions: utilsActions, reducer: utilsReducers } = utilsSlice;

export { utilsActions, utilsReducers };
