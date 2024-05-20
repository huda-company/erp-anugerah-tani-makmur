import { PaginationCustomPrms } from "../types";

export const initPgPrms: PaginationCustomPrms = {
  page: 1,
  limit: 5,
  nextPage: null,
  prevPage: null,
  totalPages: 0,
};

export const handlePrmChangeNextBtn = (prm: PaginationCustomPrms) => {
  const newPage = prm.page + 1;
  return {
    ...prm,
    page: newPage,
  };
};

export const handlePrmChangePrevBtn = (prm: PaginationCustomPrms) => {
  const newPage = prm.page - 1;
  return {
    ...prm,
    page: newPage,
  };
};

export const handlePrmChangeInputPage = (
  prm: PaginationCustomPrms,
  page: number
) => {
  return {
    ...prm,
    page: page ?? 1,
  };
};

export const handlePrmChangeRowPage = (
  prm: PaginationCustomPrms,
  page: number
) => {
  return {
    ...prm,
    page: 1,
    limit: page ?? 1,
  };
};
