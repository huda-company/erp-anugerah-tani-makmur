import { ApiResponse } from "^/@types/server";
import { ErrorType, SuccessType } from "./apiRespMsg";

export const statCode = {
  200: { status: 200 },
  400: { status: 400 },
  401: { status: 401 },
  405: { status: 405 },
  500: { status: 500 },
};

function createResponse<T>(success: boolean, message: string): ApiResponse<T> {
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
    UNEXPECTED_ERROR: createResponse(false, ErrorType.UNEXPECTED_ERROR),
    INVALID_PO: createResponse(false, ErrorType.INVALID_PO),
    INCORRECT_PAYLOAD: createResponse(false, ErrorType.INCORRECT_PAYLOAD),
    UPLOAD_ERROR: createResponse(false, ErrorType.UPLOAD_ERROR),
    EXPIRED_INVALID_TOKEN: createResponse(
      false,
      ErrorType.EXPIRED_INVALID_TOKEN
    ),
    INC_EMAIL_PASSWORD: createResponse(false, ErrorType.INC_EMAIL_PASSWORD),
    EMAIL_OR_PHONE_ALREADY_REGISTERED: createResponse(
      false,
      ErrorType.EMAIL_OR_PHONE_ALREADY_REGISTERED
    ),
    UNKNOWN_EMAIL: createResponse(false, ErrorType.UNKNOWN_EMAIL),
    PURCHASE_UPDATE: createResponse(false, ErrorType.PURCHASE_UPDATE),
  },
  SUCCESS: {
    RETRIEVED_DATA_SUCCESS: createResponse(
      true,
      SuccessType.RETRIEVED_DATA_SUCCESS
    ),
    SIGN_IN_SUCCESS: createResponse(true, SuccessType.SIGN_IN_SUCCESS),
    UPLOAD_FILE_SUCCESS: createResponse(true, SuccessType.UPLOAD_FILE_SUCCESS),
    NEW_ROLE_CREATE: createResponse(true, SuccessType.NEW_ROLE_CREATE),
    NEW_SUPPLIER_CREATE: createResponse(true, SuccessType.NEW_SUPPLIER_CREATE),
    SUPPLIER_UPDATE: createResponse(true, SuccessType.SUPPLIER_UPDATE),
    SUPPLIER_DELETE: createResponse(true, SuccessType.SUPPLIER_DELETE),
    NEW_USER_CREATE: createResponse(true, SuccessType.NEW_USER_CREATE),
    USER_UPDATE: createResponse(true, SuccessType.USER_UPDATE),
    USER_DELETE: createResponse(true, SuccessType.USER_DELETE),
    NEW_ITEM_CAT_CREATE: createResponse(true, SuccessType.NEW_ITEM_CAT_CREATE),
    BRANCH_UPDATE: createResponse(true, SuccessType.BRANCH_UPDATE),
    BRANCH_DELETE: createResponse(true, SuccessType.BRANCH_DELETE),
    ITEM_CAT_UPDATE: createResponse(true, SuccessType.ITEM_CAT_UPDATE),
    ITEM_CAT_DELETE: createResponse(true, SuccessType.ITEM_CAT_DELETE),
    NEW_ITEM_CREATE: createResponse(true, SuccessType.NEW_ITEM_CREATE),
    ITEM_UPDATE: createResponse(true, SuccessType.ITEM_UPDATE),
    ITEM_DELETE: createResponse(true, SuccessType.ITEM_DELETE),
    NEW_PURCHASE_CREATE: createResponse(true, SuccessType.NEW_PURCHASE_CREATE),
    PURCHASE_UPDATE: createResponse(true, SuccessType.PURCHASE_UPDATE),
    PURCHASE_DELETE: createResponse(true, SuccessType.PURCHASE_DELETE),
    NEW_UNIT_CREATE: createResponse(true, SuccessType.NEW_UNIT_CREATE),
    UNIT_UPDATE: createResponse(true, SuccessType.UNIT_UPDATE),
    UNIT_DELETE: createResponse(true, SuccessType.UNIT_DELETE),
  },
};
