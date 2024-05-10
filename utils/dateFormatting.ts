import moment from "moment";

export const defaultDateFormat = "DD-MM-YYYY";

export const formatDate = (prm: string, format?: string) => {
  const frmt = format ?? defaultDateFormat;
  return moment(prm).format(frmt);
};
