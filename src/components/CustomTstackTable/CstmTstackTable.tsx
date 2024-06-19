import React from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Filter from "./Filter";
import { Input } from "../ui/input";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { CstmTstackTableProps } from "./types";
import EmptyContent from "../EmptyContent/EmptyContent";

const CstmTstackTable = <T,>({
  columns,
  data,
  globalFilter,
  setGlobalFilter,
  handleResetFilter,
}: CstmTstackTableProps<T>) => {
  const t = useTranslations("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      <div className="flex items-end justify-end py-2">
        <div className="flex gap-x-4">
          <Input
            className="bg-[#ECF8DA]"
            value={globalFilter}
            onChange={(e) => setGlobalFilter && setGlobalFilter(e.target.value)}
            placeholder={capitalizeStr(t("Common.search"))}
          />
          <Button
            onClick={handleResetFilter}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Reset Filter
          </Button>
        </div>
      </div>

      <table className="w-full">
        <thead className="rounded-t-[0.5rem] bg-[#98DC65]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className="p-4">
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-[#ECF8DA]">
          {table.getRowCount() === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                <div className="flex w-full items-center justify-center">
                  <EmptyContent />
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default CstmTstackTable;
