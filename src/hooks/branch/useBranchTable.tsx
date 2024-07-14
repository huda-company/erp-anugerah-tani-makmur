import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import useGetBranch from "./useGetBranch";
import { IBranchGetReq } from "^/@types/models/branch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { initBranchReqPrm } from "^/config/branch/config";

const useBranchTable = (columns: any) => {
  const queryClient = useQueryClient();
  const bchPgntn = queryClient.getQueryData<IBranchGetReq>(["bchPgntn"]);
  const glbFltr = queryClient.getQueryData<any>(["bchGlobFltr"]);
  const bchData = queryClient.getQueryData<any>(["branch"]);

  const { fetch } = useGetBranch();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const pgntMut = useMutation({
    mutationFn: async (prm: IBranchGetReq) => {
      await queryClient.setQueryData(["bchGlobFltr"], prm["param[search]"]);

      return await fetch(prm);
    },
    onSettled: async (mutRes: any) => {
      await queryClient.setQueryData(["bchPgntn"], {
        ...bchPgntn,
        page: 1,
        limit: mutRes.limit ?? 1,
      });
    },
  });

  const handleGlobFltrChange = (prm: string) => {
    if (bchPgntn) {
      pgntMut.mutate({
        ...bchPgntn,
        "param[search]": prm,
      });
    }
  };

  const table = useReactTable({
    data: bchData ? bchData?.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter: glbFltr,
      pagination: {
        pageIndex: Number(bchData?.page - 1),
        pageSize: bchData?.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobFltrChange,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: bchData?.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: true,
  });

  const handleResetFilter = async () => {
    if (bchPgntn) {
      pgntMut.mutate(initBranchReqPrm);
    }
  };

  const handleFirstPageClck = () => {
    if (bchPgntn) {
      pgntMut.mutate({
        ...bchPgntn,
        page: 0,
        limit: bchPgntn.limit,
      });
    }
  };

  const handleLastPageClck = () => {
    const lastPage = table.getPageCount();
    if (bchPgntn) {
      pgntMut.mutate({
        ...bchPgntn,
        page: lastPage,
        limit: bchPgntn.limit,
      });
    }
  };

  const handleNextClck = () => {
    const newPage = Number(bchData.page) + 1;
    if (bchPgntn) {
      pgntMut.mutate({
        ...bchPgntn,
        page: newPage,
        limit: bchPgntn.limit,
      });
    }
  };

  const handlePrevClck = () => {
    const newPage = Number(bchData.page) - 1;
    if (bchPgntn) {
      pgntMut.mutate({
        ...bchPgntn,
        page: newPage,
        limit: bchPgntn.limit,
      });
    }
  };

  const handlePageInputChange = (prm: number) => {
    if (bchPgntn) {
      queryClient.setQueryData(["bchPgntn"], {
        ...bchPgntn,
        page: Number(prm),
      });
      fetch({ ...bchPgntn, page: Number(prm) });
    }
  };

  const handlePageRowChange = async (prm: number) => {
    if (bchPgntn) {
      await pgntMut.mutate({
        ...bchPgntn,
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

export default useBranchTable;
