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

export const USER_PAGE = {
  DASHBOARD: "/dashboard",
};

export const SUPPLIER_PAGE = {
  ROOT: "/supplier",
  ADD: "/supplier/add",
  EDIT: "/supplier/edit",
  VIEW: "/supplier/view",
};
