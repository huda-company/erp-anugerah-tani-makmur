import { API_VERSION, BASE_URL } from "^/config/env";

export const BASE_API_URL = `${BASE_URL}/api/${API_VERSION}`;

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

export const SUPPLIER = {
  PAGE: {
    ROOT: "/supplier",
    ADD: "/supplier/add",
    EDIT: "/supplier/edit",
    VIEW: "/supplier/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/supplier`,
    EDIT: `${BASE_API_URL}/supplier/edit`,
    DELETE: `${BASE_API_URL}/supplier/delete`,
  },
};

export const SUPPLIER_STOCK = {
  PAGE: {
    ROOT: "/supplier-stock",
  },
  API: {
    ROOT: `${BASE_API_URL}/supplier-stock`,
  },
};

export const PO = {
  PAGE: {
    ROOT: "/purchase",
    ADD: "/purchase/add",
    EDIT: "/purchase/edit",
    VIEW: "/purchase/view",
    PDF: "/purchase/pdf",
  },
  API: {
    ROOT: `${BASE_API_URL}/purchase`,
    EDIT: `${BASE_API_URL}/purchase/update`,
    DELETE: `${BASE_API_URL}/purchase/delete`,
    APPROVE: `${BASE_API_URL}/purchase/approve`,
  },
};

export const ITEM_CAT = {
  PAGE: {
    ROOT: "/itemcategory",
    ADD: "/itemcategory/add",
    EDIT: "/itemcategory/edit",
    VIEW: "/itemcategory/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/item-category`,
    EDIT: `${BASE_API_URL}/item-category/update`,
    DELETE: `${BASE_API_URL}/item-category/delete`,
  },
};

export const ITEM = {
  PAGE: {
    ROOT: "/item",
    ADD: "/item/add",
    EDIT: "/item/edit",
    VIEW: "/item/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/item`,
    EDIT: `${BASE_API_URL}/item/update`,
    DELETE: `${BASE_API_URL}/item/delete`,
  },
};

export const UNIT = {
  PAGE: {
    ROOT: "/unit",
    ADD: "/unit/add",
    EDIT: "/unit/edit",
    VIEW: "/unit/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/unit`,
    EDIT: `${BASE_API_URL}/unit/update`,
    DELETE: `${BASE_API_URL}/unit/delete`,
  },
};

export const STOCK = {
  PAGE: {
    ROOT: "/stock",
    ADD: "/stock/add",
    EDIT: "/stock/edit",
    VIEW: "/stock/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/stock`,
  },
};

export const CASHFLOW = {
  PAGE: {
    ROOT: "/cashflow",
    ADD: "/cashflow/add",
    EDIT: "/cashflow/edit",
    VIEW: "/cashflow/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/cashflow`,
  },
};

export const CASHFLOW_HIST = {
  PAGE: {
    ROOT: `${CASHFLOW.PAGE.ROOT}/history`,
  },
  API: {
    ROOT: `${BASE_API_URL}/cashflow-hist`,
  },
};

export const BRANCH = {
  PAGE: {
    ROOT: "/branch",
    ADD: "/branch/add",
    EDIT: "/branch/edit",
    VIEW: "/branch/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/branch`,
    EDIT: `${BASE_API_URL}/branch/update`,
    DELETE: `${BASE_API_URL}/branch/delete`,
  },
};

export const PURCHASE_PAYMENT = {
  PAGE: {
    ROOT: "/payment-purchase",
    ADD: "/payment-purchase/add",
    EDIT: "/payment-purchase/edit",
    VIEW: "/payment-purchase/view",
    PDF: "/payment-purchase/pdf",
  },
  API: {
    ROOT: `${BASE_API_URL}/payment-purchase`,
    EDIT: `${BASE_API_URL}/payment-purchase/update`,
    DELETE: `${BASE_API_URL}/payment-purchase/delete`,
  },
};

export const DELIV_NOTE = {
  PAGE: {
    ROOT: "/delivery-note",
    ADD: "/delivery-note/add",
    EDIT: "/delivery-note/edit",
    VIEW: "/delivery-note/view",
    PDF: "/delivery-note/pdf",
  },
  API: {
    ROOT: `${BASE_API_URL}/delivery-note`,
    EDIT: `${BASE_API_URL}/delivery-note/update`,
    DELETE: `${BASE_API_URL}/delivery-note/delete`,
  },
};

export const DELIV_NOTE_PAYMENT = {
  PAGE: {
    ROOT: "/payment-deliverynote",
    ADD: "/payment-deliverynote/add",
    EDIT: "/payment-deliverynote/edit",
    VIEW: "/payment-deliverynote/view",
    PDF: "/payment-deliverynote/pdf",
  },
  API: {
    ROOT: `${BASE_API_URL}/payment-deliverynote`,
    EDIT: `${BASE_API_URL}/payment-deliverynote/update`,
    DELETE: `${BASE_API_URL}/payment-deliverynote/delete`,
  },
};

export const BILL_DOC = {
  PAGE: {
    ROOT: "/billdoc",
    ADD: "/billdoc/add",
    EDIT: "/billdoc/edit",
    VIEW: "/billdoc/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/billdoc`,
    EDIT: `${BASE_API_URL}/billdoc/update`,
    DELETE: `${BASE_API_URL}/billdoc/delete`,
  },
};

export const PICKUP_DOC = {
  PAGE: {
    ROOT: "/pickup-doc",
    ADD: "/pickup-doc/add",
    EDIT: "/pickup-doc/edit",
    VIEW: "/pickup-doc/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/pickup-doc`,
    EDIT: `${BASE_API_URL}/pickup-doc/update`,
    DELETE: `${BASE_API_URL}/pickup-doc/delete`,
  },
};

export const USER = {
  PAGE: {
    ROOT: "/user",
    ADD: "/user/add",
    EDIT: "/user/edit",
    VIEW: "/user/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/user`,
    EDIT: `${BASE_API_URL}/user/update`,
    DELETE: `${BASE_API_URL}/user/delete`,
  },
};

export const ROLE = {
  PAGE: {
    ROOT: "/role",
    ADD: "/role/add",
    EDIT: "/role/edit",
    VIEW: "/role/view",
  },
  API: {
    ROOT: `${BASE_API_URL}/role`,
    EDIT: `${BASE_API_URL}/role/update`,
    DELETE: `${BASE_API_URL}/role/delete`,
  },
};

export const STOCK_HIST = {
  PAGE: {
    ROOT: `${STOCK.PAGE.ROOT}/history`,
    ADD: `${STOCK.PAGE.ROOT}/history/add`,
    EDIT: `${STOCK.PAGE.ROOT}/history/edit`,
    VIEW: `${STOCK.PAGE.ROOT}/view`,
  },
  API: {
    ROOT: `${BASE_API_URL}/stock-hist`,
    EDIT: `${BASE_API_URL}/stock-hist/update`,
    DELETE: `${BASE_API_URL}/stock-hist/delete`,
  },
};

export const SUPP_STOCK_HIST = {
  PAGE: {
    ROOT: "/supplier-stock/history",
  },
  API: {
    ROOT: `${BASE_API_URL}/supplier-stock-hist`,
    EDIT: `${BASE_API_URL}/supplier-stock-hist/update`,
    DELETE: `${BASE_API_URL}/supplier-stock-hist/delete`,
  },
};
