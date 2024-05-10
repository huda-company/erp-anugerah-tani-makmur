/* eslint-disable unused-imports/no-unused-vars */
export type PaginationCustomProp = {
  page: number;
  row?: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  onPageInputChange?: (pageNo: number) => void;
  onPageNumberClick?: (pageNo: number) => void;
  onPageRowChange?: (limitNo: number) => void;
};

export type PaginationCustomPrms = {
  page: number;
  limit: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
};
