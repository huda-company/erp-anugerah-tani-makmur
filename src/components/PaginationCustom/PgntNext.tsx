import { FC } from "react";
import { PaginationCustomProp } from "./types";
import { PaginationItem, PaginationNext } from "../ui/pagination";

const PgntNext: FC<PaginationCustomProp> = ({ onNextClick }) => {
  return (
    <PaginationItem key="nextArrow">
      <PaginationNext onClick={onNextClick} />
    </PaginationItem>
  );
};

export default PgntNext;
