import { FC } from "react";
import { PaginationCustomProp } from "./types";
import { PaginationItem, PaginationPrevious } from "../ui/pagination";

const PgntPrev: FC<PaginationCustomProp> = ({ onPrevClick }) => {
  return (
    <PaginationItem key="prevArrow">
      <PaginationPrevious onClick={onPrevClick} />
    </PaginationItem>
  );
};

export default PgntPrev;
