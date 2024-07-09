import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import { initSuppReqPrm } from "^/config/supplier/config";
import useGetDelivNote from "./useGetDelivNote";
import { DelivNoteTanTblData } from "^/@types/models/deliverynote";

const useDelivNoteTable = (
  data: DelivNoteTanTblData[],
  columns: any,
  itemPgntn: PaginationCustomPrms
) => {
  const { reqPrm, setReqPrm } = useGetDelivNote();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debGlobFltr = useDebounce(globalFilter, 500); // Adjust delay as needed

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: Number(itemPgntn.page - 1),
        pageSize: itemPgntn.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: itemPgntn.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: false,
  });

  const handleNextPgnt = () => {
    table.setPagination({
      pageIndex: table.getState().pagination.pageIndex + 1,
      pageSize: table.getState().pagination.pageSize,
    });
  };

  const handlePrevPgnt = () => {
    table.setPagination({
      pageIndex: table.getState().pagination.pageIndex - 1,
      pageSize: table.getState().pagination.pageSize,
    });
  };

  const handleResetFilter = () => {
    setGlobalFilter("");
    setReqPrm({
      ...initSuppReqPrm,
      "param[search]": "",
      page: 1,
      limit: reqPrm.limit,
    });
  };

  return {
    table,
    columnFilters,
    globalFilter,
    debGlobFltr,
    setColumnFilters,
    setGlobalFilter,
    handleNextPgnt,
    handlePrevPgnt,
    handleResetFilter,
  };
};

export default useDelivNoteTable;
