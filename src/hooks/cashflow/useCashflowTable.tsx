import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetCashflow from "./useGetCashflow";
import { useSession } from "next-auth/react";
import { ICashflowGetReq } from "^/@types/models/cashflow";
import { initCflReqPrm } from "^/config/cashflow/config";

const useCashflowTable = (columns: any) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const cflPgntn = queryClient.getQueryData<ICashflowGetReq>(["cflPgntn"]);
  const glbFltr = queryClient.getQueryData<any>(["cflGlobFltr"]);
  const cflData = queryClient.getQueryData<any>(["cashflow"]);

  const { fetchCashflowData } = useGetCashflow();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pgntMut = useMutation({
    mutationFn: async (prm: ICashflowGetReq) => {
      await queryClient.setQueryData(["cflGlobFltr"], prm["param[search]"]);

      return await fetchCashflowData(session, prm);
    },
    onSettled: async (mutRes: any) => {
      await queryClient.setQueryData(["cflPgntn"], {
        ...cflPgntn,
        page: 1,
        limit: mutRes.limit ?? 1,
      });
    },
  });

  const handleGlobFltrChange = (prm: string) => {
    if (cflPgntn) {
      pgntMut.mutate({
        ...cflPgntn,
        "param[search]": prm,
      });
    }
  };

  const table = useReactTable({
    data: cflData ? cflData?.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter: glbFltr,
      pagination: {
        pageIndex: Number(cflData?.page - 1),
        pageSize: cflData?.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobFltrChange,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: cflData?.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: true,
  });

  const handleResetFilter = async () => {
    if (cflPgntn) {
      pgntMut.mutate(initCflReqPrm);
    }
  };

  const handleFirstPageClck = () => {
    if (cflPgntn) {
      pgntMut.mutate({
        ...cflPgntn,
        page: 0,
        limit: cflPgntn.limit,
      });
    }
  };

  const handleLastPageClck = () => {
    const lastPage = table.getPageCount();
    if (cflPgntn) {
      pgntMut.mutate({
        ...cflPgntn,
        page: lastPage,
        limit: cflPgntn.limit,
      });
    }
  };

  const handleNextClck = () => {
    const newPage = Number(cflData.page) + 1;
    if (cflPgntn) {
      pgntMut.mutate({
        ...cflPgntn,
        page: newPage,
        limit: cflPgntn.limit,
      });
    }
  };

  const handlePrevClck = () => {
    const newPage = Number(cflData.page) - 1;
    if (cflPgntn) {
      pgntMut.mutate({
        ...cflPgntn,
        page: newPage,
        limit: cflPgntn.limit,
      });
    }
  };

  const handlePageInputChange = (prm: number) => {
    if (cflPgntn) {
      queryClient.setQueryData(["cflPgntn"], {
        ...cflPgntn,
        page: Number(prm),
      });
      fetchCashflowData(session, { ...cflPgntn, page: Number(prm) });
    }
  };

  const handlePageRowChange = async (prm: number) => {
    if (cflPgntn) {
      await pgntMut.mutate({
        ...cflPgntn,
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

export default useCashflowTable;
