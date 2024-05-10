import { FC } from "react";
import { PaginationCustomProp } from "./types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import PgntPrev from "./PgntPrev";
import PgntNext from "./PgntNext";
import { noop } from "^/utils/helpers";

const PgntNavCmpnt: FC<PaginationCustomProp> = ({
  page,
  nextPage,
  prevPage,
  totalPages,
  onNextClick,
  onPrevClick,
  onPageNumberClick,
}) => {
  const buildPageArr = (page: number) => {
    const arr = [prevPage, page, nextPage];

    return arr;
  };

  const renderNav = () => {
    const arr = buildPageArr(page);
    return (
      <Pagination key="pgntParent">
        <PaginationContent key="pgntContent">
          {prevPage && (
            <PgntPrev
              onPrevClick={page > 1 ? onPrevClick : noop}
              page={page}
              nextPage={nextPage}
              prevPage={prevPage}
              totalPages={totalPages}
            />
          )}

          {page >= 3 && (
            <PaginationItem key={"prevEllips"}>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {arr.map((i) => {
            return (
              <>
                <PaginationItem
                  key={i}
                  onClick={() => i && onPageNumberClick && onPageNumberClick(i)}
                >
                  <PaginationLink key={`link${i}`} isActive={i === page}>
                    {i}
                  </PaginationLink>
                </PaginationItem>
              </>
            );
          })}

          {totalPages > 3 && page != totalPages && (
            <PaginationItem key={"nextEllips"}>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {nextPage && (
            <PgntNext
              onNextClick={page < totalPages ? onNextClick : noop}
              page={page}
              nextPage={nextPage}
              prevPage={prevPage}
              totalPages={totalPages}
            />
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return renderNav();
};

export default PgntNavCmpnt;
