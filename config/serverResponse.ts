import { API_MSG } from "./apiRespMsg";

import { ApiResponse } from "^/@types/server";
import { capitalizeStr } from "^/utils/capitalizeStr";

export const statCode = {
  200: { status: 200 },
  400: { status: 400 },
  401: { status: 401 },
  405: { status: 405 },
  500: { status: 500 },
};

export const resBody: ApiResponse<any> = {
  success: false,
  message: "",
};

export const respBody = {
  ERROR: {
    UNEXPECTED_ERROR: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.UNEXPECTED_ERROR),
    },
    EXPIRED_INVALID_TOKEN: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.EXPIRED_INVALID_TOKEN),
    },
    INC_EMAIL_PASSWORD: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.INC_EMAIL_PASSWORD),
    },
    UNKNOWN_EMAIL: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.UNKNOWN_EMAIL),
    },
    UNKNOWN_PARAMETER: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.UNKNOWN_PARAMETER),
    },
    EMAIL_OR_PHONE_ALREADY_REGISTERED: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.EMAIL_OR_PHONE_ALREADY_REGISTERED),
    },
    EMAIL_UNVERIFIED: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.EMAIL_UNVERIFIED),
    },
    EMAIL_VERIF_CODE_EMPTY: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.EMAIL_VERIF_CODE_EMPTY),
    },
    EMAIL_VERIF_CODE_MISMATCH: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.EMAIL_VERIF_CODE_MISMATCH),
    },
    EMAIL_ALREADY_VERIFIED: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.EMAIL_ALREADY_VERIFIED),
    },
    FEATURE_IS_DISABLE: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.EMAIL_ALREADY_VERIFIED),
    },
    METHOD_NOT_ALLLOWED: {
      ...resBody,
      message: capitalizeStr(API_MSG.ERROR.METHOD_NOT_ALLOWED),
    },
  },
  SUCCESS: {
    RETRIEVED_DATA_SUCCESS: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.RETRIEVED_DATA_SUCCESS),
    },
    NEW_USER_CREATE: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.NEW_USER_CREATE),
    },
    NEW_ROLE_CREATE: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.NEW_ROLE_CREATE),
    },
    NEW_PARKING_FIELD_CREATE: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.NEW_PARKING_FIELD_CREATE),
    },
    PARKING_FIELD_UPDATE: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.PARKING_FIELD_UPDATE),
    },
    PARKING_FIELD_DELETE: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.PARKING_FIELD_DELETE),
    },

    SIGN_IN_SUCCESS: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.SIGN_IN_SUCCESS),
    },
    EMAIL_VERIF_SUCCESS: {
      ...resBody,
      success: true,
      message: capitalizeStr(API_MSG.SUCCESS.EMAIL_VERIF_SUCCESS),
    },
  },
};
