import { ApiResponse } from "^/@types/server";
import { ErrorType, SuccessType } from "./apiRespMsg";

export const statCode = {
  200: { status: 200 },
  400: { status: 400 },
  401: { status: 401 },
  405: { status: 405 },
  500: { status: 500 },
};

function cResp<T>(success: boolean, message: string): ApiResponse<T> {
  return {
    success,
    message,
  };
}

export const API_MSG = {
  ERROR: ErrorType,
  SUCCESS: SuccessType,
};

export const respBody = {
  ERROR: {
    UNEXPECTED_ERROR: cResp(false, ErrorType.UNEXPECTED_ERROR),
    GTOTAL_N_PAYMENT_EQUAL: cResp(false, ErrorType.GTOTAL_N_PAYMENT_EQUAL),
    INVALID_PO: cResp(false, ErrorType.INVALID_PO),
    INCORRECT_PAYLOAD: cResp(false, ErrorType.INCORRECT_PAYLOAD),
    UPLOAD_ERROR: cResp(false, ErrorType.UPLOAD_ERROR),
    EXPIRED_INVALID_TOKEN: cResp(false, ErrorType.EXPIRED_INVALID_TOKEN),
    INC_EMAIL_PASSWORD: cResp(false, ErrorType.INC_EMAIL_PASSWORD),
    EMAIL_OR_PHONE_ALREADY_REGISTERED: cResp(
      false,
      ErrorType.EMAIL_OR_PHONE_ALREADY_REGISTERED
    ),
    UNKNOWN_EMAIL: cResp(false, ErrorType.UNKNOWN_EMAIL),
    PURCHASE_UPDATE: cResp(false, ErrorType.PURCHASE_UPDATE),
    PURCHASE_PAYMENT_CREATE: cResp(true, SuccessType.PURCHASE_PAYMENT_CREATE),
  },
  SUCCESS: {
    RETRIEVED_DATA_SUCCESS: cResp(true, SuccessType.RETRIEVED_DATA_SUCCESS),
    SIGN_IN_SUCCESS: cResp(true, SuccessType.SIGN_IN_SUCCESS),
    UPLOAD_FILE_SUCCESS: cResp(true, SuccessType.UPLOAD_FILE_SUCCESS),
    NEW_ROLE_CREATE: cResp(true, SuccessType.NEW_ROLE_CREATE),
    NEW_SUPPLIER_CREATE: cResp(true, SuccessType.NEW_SUPPLIER_CREATE),
    SUPPLIER_UPDATE: cResp(true, SuccessType.SUPPLIER_UPDATE),
    SUPPLIER_DELETE: cResp(true, SuccessType.SUPPLIER_DELETE),
    NEW_USER_CREATE: cResp(true, SuccessType.NEW_USER_CREATE),
    USER_UPDATE: cResp(true, SuccessType.USER_UPDATE),
    USER_DELETE: cResp(true, SuccessType.USER_DELETE),
    NEW_ITEM_CAT_CREATE: cResp(true, SuccessType.NEW_ITEM_CAT_CREATE),
    BRANCH_UPDATE: cResp(true, SuccessType.BRANCH_UPDATE),
    BRANCH_DELETE: cResp(true, SuccessType.BRANCH_DELETE),
    ITEM_CAT_UPDATE: cResp(true, SuccessType.ITEM_CAT_UPDATE),
    ITEM_CAT_DELETE: cResp(true, SuccessType.ITEM_CAT_DELETE),
    NEW_ITEM_CREATE: cResp(true, SuccessType.NEW_ITEM_CREATE),
    ITEM_UPDATE: cResp(true, SuccessType.ITEM_UPDATE),
    ITEM_DELETE: cResp(true, SuccessType.ITEM_DELETE),
    NEW_PURCHASE_CREATE: cResp(true, SuccessType.NEW_PURCHASE_CREATE),
    PURCHASE_UPDATE: cResp(true, SuccessType.PURCHASE_UPDATE),
    PURCHASE_DELETE: cResp(true, SuccessType.PURCHASE_DELETE),
    NEW_UNIT_CREATE: cResp(true, SuccessType.NEW_UNIT_CREATE),
    UNIT_UPDATE: cResp(true, SuccessType.UNIT_UPDATE),
    UNIT_DELETE: cResp(true, SuccessType.UNIT_DELETE),
    PURCHASE_PAYMENT_CREATE: cResp(true, SuccessType.PURCHASE_PAYMENT_CREATE),
  },
};
