/* eslint-disable unused-imports/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { initialState } from "./data";
import type { Toast } from "./models";

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    toggleToast: (state, { payload }: PayloadAction<Toast>) => {
      state.obj = { ...payload };
    },
    resetToast: (state) => {
      state = initialState;
    },
    PURGE: (state) => {
      state = initialState;
    },
  },
});

const { actions: toastActions, reducer: toastReducers } = toastSlice;

export { toastActions, toastReducers };
