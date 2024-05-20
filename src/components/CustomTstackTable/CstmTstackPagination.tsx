import React from "react";
import { GrLinkPrevious } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { GrLinkNext } from "react-icons/gr";
import { GrChapterNext } from "react-icons/gr";
import { CstmTstackPaginationProps } from "./types";
import { pageRowsArr } from "^/config/request/config";

const CstmTstackPagination: React.FC<CstmTstackPaginationProps> = ({
  table,
  handlePrevClick,
  handleNextClick,
  handleFirstPageClick,
  handleLastPageClick,
  handlePageInputChange,
  handlePageRowChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 bg-gray-200 px-4">
      <div className="flex gap-x-2">
        Show :{" "}
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            handlePageRowChange(Number(e.target.value));
          }}
        >
          {pageRowsArr.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        rows
      </div>
      <div>
        <button
          className="cursor-pointer rounded border p-3"
          onClick={handleFirstPageClick}
          disabled={!table.getCanPreviousPage()}
        >
          <GrChapterPrevious />
        </button>
        <button
          className="cursor-pointer rounded border p-3"
          onClick={handlePrevClick}
          disabled={!table.getCanPreviousPage()}
        >
          <GrLinkPrevious />
        </button>
        <strong>
          <span className="text-lg">
            {table.getState().pagination.pageIndex + 1}
          </span>
        </strong>
        <button
          className="cursor-pointer rounded border p-3"
          onClick={handleNextClick}
          disabled={!table.getCanNextPage()}
        >
          <GrLinkNext />
        </button>
        <button
          className="cursor-pointer rounded border p-3"
          onClick={handleLastPageClick}
          disabled={!table.getCanNextPage()}
        >
          <GrChapterNext />
        </button>
      </div>

      <div>
        <span className="flex items-center gap-1">
          Page:
          <input
            min={table.getPageCount() === 0 ? 0 : 1}
            max={table.getState().pagination.pageSize - 1}
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page =
                table.getPageCount() === 0 ? 0 : Number(e.target.value);
              // table.setPageIndex(page);
              handlePageInputChange(page);
            }}
            className="w-16 rounded border p-1"
          />
          <strong>of {table.getPageCount().toLocaleString()}</strong>
        </span>
      </div>
    </div>
  );
};

export default CstmTstackPagination;
