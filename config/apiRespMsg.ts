export const API_MSG = {
  ERROR: {
    UNEXPECTED_ERROR: "error unexpected",
    EXPIRED_INVALID_TOKEN: "token not found / invalid token",
    INC_EMAIL_PASSWORD: "incorrect email or password",
    UNKNOWN_EMAIL: "unknown email",
    UNKNOWN_PARAMETER: "unknown params or ids",
    EMAIL_OR_PHONE_ALREADY_REGISTERED: "email / phone already registered",
    EMAIL_VERIF_CODE_EMPTY:
      "email verification code is empty, please request again",
    EMAIL_VERIF_CODE_MISMATCH: "email verification code is mismatch",
    EMAIL_UNVERIFIED: "unverified email",
    EMAIL_ALREADY_VERIFIED: "email already verified",
    FEATURE_IS_DISABLE: "feature is disable",
    METHOD_NOT_ALLOWED: "request method not allowed",
    NEW_SUPPLIER_CREATE: "failed to add new parking field",
    SUPPLIER_UPDATE: "failed to update parking field",
  },
  SUCCESS: {
    NEW_USER_CREATE: "new user created successfully",
    NEW_ROLE_CREATE: "new role created successfully",

    SUPPLIER_UPDATE: "parking field updated successfully",
    SUPPLIER_DELETE: "parking field deleted successfully",

    NEW_SUPPLIER_CREATE: "new supplier field created successfully",

    NEW_ITEM_CAT_CREATE: "new item category created successfully",
    ITEM_CAT_UPDATE: "item category updated successfully",
    ITEM_CAT_DELETE: "item category deleted successfully",

    NEW_ITEM_CREATE: "new item created successfully",
    ITEM_UPDATE: "item updated successfully",
    ITEM_DELETE: "item deleted successfully",

    SIGN_IN_SUCCESS: "signin successfully",
    RETRIEVED_DATA_SUCCESS: "data retrieved successfully",
    EMAIL_VERIF_SUCCESS: "your email verified successfully",
  },
};
