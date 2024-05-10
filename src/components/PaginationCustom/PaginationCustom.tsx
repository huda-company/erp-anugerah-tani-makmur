import { FC } from "react";
import { PaginationCustomProp } from "./types";
import PgntRowCmpnt from "./PgntRowOptsCmpnt";
import PgntRowNavCmpnt from "./PgntNavCmpnt";
import PgntInputCmpnt from "./PgntInputCmpnt";

const PaginationCustom: FC<PaginationCustomProp> = ({
  row,
  page,
  nextPage,
  prevPage,
  totalPages,
  onNextClick,
  onPrevClick,
  onPageRowChange,
  onPageInputChange,
  onPageNumberClick,
}) => {
  return (
    <div className="flex cursor-pointer items-center justify-center justify-between rounded-[1rem] bg-gray-200 px-6">
      <div className="mb-2 mt-2 flex flex-row gap-4">
        <div className="flex flex-row gap-2">
          <PgntRowCmpnt
            row={row}
            page={page}
            nextPage={nextPage}
            prevPage={prevPage}
            totalPages={totalPages}
            onPageRowChange={onPageRowChange}
          />
        </div>
      </div>
      <div>
        <PgntRowNavCmpnt
          row={row}
          page={page}
          nextPage={nextPage}
          prevPage={prevPage}
          totalPages={totalPages}
          onPageNumberClick={onPageNumberClick}
          onNextClick={onNextClick}
          onPrevClick={onPrevClick}
        />
      </div>
      <div className="mb-2 mt-2 flex flex-row gap-2">
        <PgntInputCmpnt
          row={row}
          page={page}
          nextPage={nextPage}
          prevPage={prevPage}
          totalPages={totalPages}
          onPageInputChange={onPageInputChange}
        />
      </div>
    </div>
  );
};

export default PaginationCustom;
