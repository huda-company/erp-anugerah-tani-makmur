import { BASE_URL } from "^/config/env";

export const AUTH_PAGE_URL = {
  SIGNIN: `${BASE_URL}/auth/signin`,
  SIGNUP: "/auth/signup",
  SIGNUP_VERIF: "/auth/signup/verify",
  FORGOT_PASSWORD: "/auth/forgot-password",
  NOT_RECEIVED_EMAIL: "/auth/not-received-email",
  FORGOT_PASSWORD_SUCCESS: "/auth/forgot-password/success",
  NOT_RECEIVED_EMAIL_SUCCESS: "/auth/not-received-email/success",
  RESET_PASSWORD: "/auth/reset-password/[token]",
  RESET_PASSWORD_SUCCESS: "/auth/reset-password/success",
  FIRST_TIME_SIGN_IN: "/auth/first-time-sign-in/[token]",
  FIRST_TIME_SIGN_IN_SUCCESS: "/auth/first-time-sign-in/success",
};

export const SUPPLIER_PAGE = {
  ROOT: "/supplier",
  ADD: "/supplier/add",
  EDIT: "/supplier/edit",
  VIEW: "/supplier/view",
};

export const PO_PAGE = {
  ROOT: "/purchase",
  ADD: "/purchase/add",
  EDIT: "/purchase/edit",
  VIEW: "/purchase/view",
};

export const ITEM_CAT_PAGE = {
  ROOT: "/itemcategory",
  ADD: "/itemcategory/add",
  EDIT: "/itemcategory/edit",
  VIEW: "/itemcategory/view",
};

export const ITEM_PAGE = {
  ROOT: "/item",
  ADD: "/item/add",
  EDIT: "/item/edit",
  VIEW: "/item/view",
};

export const BRANCHES_PAGE = {
  ROOT: "/branches",
  ADD: "/branches/add",
  EDIT: "/branches/edit",
  VIEW: "/branches/view",
};

export const USER_PAGE = {
  ROOT: "/user",
  ADD: "/user/add",
  EDIT: "/user/edit",
  VIEW: "/user/view",
};
