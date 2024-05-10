export const ENV = process.env.NODE_ENV;
export const IS_DEV = ENV === "development";
export const IS_PRODUCTION = ENV === "production";
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION ?? "v1";
export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export const SMTP_FROM = process.env.SMTP_FROM ?? `${APP_NAME} e-mailer`;
export const SMTP_FROM_EMAIL =
  process.env.SMTP_FROM_EMAIL ?? "nunsolution@gmail.com";
export const SMTP_SERVICE = process.env.SMTP_SERVICE ?? "gmail";
export const SMTP_USER = process.env.SMTP_USER ?? "nunsolution@gmail.com";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? "hpdc yvpo fzmr difu";

export const timezone = process.env.NEXT_PUBLIC_TIMEZONE;
