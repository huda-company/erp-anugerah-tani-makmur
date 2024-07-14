import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import useGetUnit from "./useGetUnit";
import { initSuppReqPrm } from "^/config/supplier/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUnitGetReq } from "^/@types/models/unit";

const useUnitTable = (columns: any) => {
  const queryClient = useQueryClient();
  const usrPgntn = queryClient.getQueryData<IUnitGetReq>(["untPgntn"]);
  const glbFltr = queryClient.getQueryData<any>(["untGlobFltr"]);
  const untData = queryClient.getQueryData<any>(["unit"]);

  const { fetch } = useGetUnit();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pgntMut = useMutation({
    mutationFn: async (prm: IUnitGetReq) => {
      await queryClient.setQueryData(["untGlobFltr"], prm["param[search]"]);

      return await fetch(prm);
    },
    onSettled: async (mutRes: any) => {
      await queryClient.setQueryData(["untPgntn"], {
        ...usrPgntn,
        page: 1,
        limit: mutRes.limit ?? 1,
      });
    },
  });

  const handleGlobFltrChange = (prm: string) => {
    if (usrPgntn) {
      pgntMut.mutate({
        ...usrPgntn,
        "param[search]": prm,
      });
    }
  };

  const table = useReactTable({
    data: untData ? untData?.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter: glbFltr,
      pagination: {
        pageIndex: Number(untData?.page - 1),
        pageSize: untData?.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobFltrChange,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: untData?.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: true,
  });

  const handleResetFilter = async () => {
    if (usrPgntn) {
      pgntMut.mutate(initSuppReqPrm);
    }
  };

  const handleFirstPageClck = () => {
    if (usrPgntn) {
      pgntMut.mutate({
        ...usrPgntn,
        page: 0,
        limit: usrPgntn.limit,
      });
    }
  };

  const handleLastPageClck = () => {
    const lastPage = table.getPageCount();
    if (usrPgntn) {
      pgntMut.mutate({
        ...usrPgntn,
        page: lastPage,
        limit: usrPgntn.limit,
      });
    }
  };

  const handleNextClck = () => {
    const newPage = Number(untData.page) + 1;
    if (usrPgntn) {
      pgntMut.mutate({
        ...usrPgntn,
        page: newPage,
        limit: usrPgntn.limit,
      });
    }
  };

  const handlePrevClck = () => {
    const newPage = Number(untData.page) - 1;
    if (usrPgntn) {
      pgntMut.mutate({
        ...usrPgntn,
        page: newPage,
        limit: usrPgntn.limit,
      });
    }
  };

  const handlePageInputChange = (prm: number) => {
    if (usrPgntn) {
      queryClient.setQueryData(["usrPgntn"], {
        ...usrPgntn,
        page: Number(prm),
      });
      fetch({ ...usrPgntn, page: Number(prm) });
    }
  };

  const handlePageRowChange = async (prm: number) => {
    if (usrPgntn) {
      await pgntMut.mutate({
        ...usrPgntn,
        page: 1,
        limit: prm ?? 1,
      });
    }
  };

  return {
    table,
    columnFilters,
    pgntMut,
    setColumnFilters,
    handleGlobFltrChange,
    handleResetFilter,
    handleFirstPageClck,
    handleLastPageClck,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  };
};

export default useUnitTable;
