export enum ErrorType {
  UNEXPECTED_ERROR = "error unexpected",
  UPLOAD_ERROR = "upload file is failed",
  EXPIRED_INVALID_TOKEN = "token not found / invalid token",
  INC_EMAIL_PASSWORD = "incorrect email or password",
  UNKNOWN_EMAIL = "unknown email",
  UNKNOWN_PARAMETER = "unknown params or ids",
  EMAIL_OR_PHONE_ALREADY_REGISTERED = "email / phone already registered",
  EMAIL_VERIF_CODE_EMPTY = "email verification code is empty, please request again",
  EMAIL_VERIF_CODE_MISMATCH = "email verification code is mismatch",
  EMAIL_UNVERIFIED = "unverified email",
  EMAIL_ALREADY_VERIFIED = "email already verified",
  FEATURE_IS_DISABLE = "feature is disable",
  METHOD_NOT_ALLOWED = "request method not allowed",
  INCORRECT_PAYLOAD = "incorrect payload",
  INVALID_PO = "invalid po number or deleted",
  INVALID_PAYMENT_PURCH_ID = "invalid payment purchase id",
  INVALID_SUPP_ID = "invalid supplier id",

  NEW_SUPPLIER_CREATE = "failed to add new parking field",
  SUPPLIER_UPDATE = "failed to update parking field",

  NEW_PURCHASE_CREATE = "create purchase failed",
  PURCHASE_UPDATE = "update purchase failed",
  PURCHASE_DELETE = "delete purchase failed",

  GTOTAL_N_PAYMENT_EQUAL = "grand total and payment is equal or amount is greater",
  PURCHASE_PAYMENT_CREATE = "create purchase payment failed",
  PURCHASE_PAYMENT_DELETE = "delete purchase failed",

  PICKUP_DOC_CREATE = "create pickup doc failed",
  PICKUP_DOC_DELETE = "delete pickup doc failed",
  RELEASED_PURCHASE_CANT_APPTOVED = "released purchase can't be approved ",
}

export enum SuccessType {
  NEW_ROLE_CREATE = "new role created successfully",

  SUPPLIER_UPDATE = "parking field updated successfully",
  SUPPLIER_DELETE = "parking field deleted successfully",

  NEW_SUPPLIER_CREATE = "new supplier field created successfully",

  NEW_ITEM_CAT_CREATE = "new item category created successfully",
  ITEM_CAT_UPDATE = "item category updated successfully",
  ITEM_CAT_DELETE = "item category deleted successfully",

  NEW_ITEM_CREATE = "new item created successfully",
  ITEM_UPDATE = "item updated successfully",
  ITEM_DELETE = "item deleted successfully",

  NEW_BRANCH_CREATE = "new branch created successfully",
  BRANCH_UPDATE = "branch updated successfully",
  BRANCH_DELETE = "branch deleted successfully",

  NEW_UNIT_CREATE = "new unit created successfully",
  UNIT_UPDATE = "unit updated successfully",
  UNIT_DELETE = "unit deleted successfully",

  NEW_PURCHASE_CREATE = "new purchase created successfully",
  PURCHASE_UPDATE = "purchase updated successfully",
  PURCHASE_DELETE = "purchase deleted successfully",
  PURCHASE_APPROVED = "purchase approved successfully",

  NEW_USER_CREATE = "new user created successfully",
  USER_UPDATE = "user updated successfully",
  USER_DELETE = "user deleted successfully",

  SIGN_IN_SUCCESS = "signin successfully",
  RETRIEVED_DATA_SUCCESS = "data retrieved successfully",
  UPLOAD_FILE_SUCCESS = "file uploaded successfully",
  EMAIL_VERIF_SUCCESS = "your email verified successfully",

  PURCHASE_PAYMENT_CREATE = "new purchase payment created successfully",
  PURCHASE_PAYMENT_DELETE = "purchase payment deleted successfully",

  PICKUP_DOC_CREATE = "pickup doc created successfully",
  PICKUP_DOC_DELETE = "pickup doc deleted successfully",
}
