import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { ISuppGetReq } from "^/@types/models/supplier";
import { initSuppReqPrm } from "^/config/supplier/config";
import useGetSupplier from "./useGetSupplier";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSupplierTable = (columns: any) => {
  const queryClient = useQueryClient();
  const suppPgntn = queryClient.getQueryData<ISuppGetReq>(["suppPgntn"]);
  const glbFltr = queryClient.getQueryData<any>(["suppGlobFltr"]);
  const suppData = queryClient.getQueryData<any>(["supplier"]);

  const { fetch } = useGetSupplier();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pgntMut = useMutation({
    mutationFn: async (prm: ISuppGetReq) => {
      await queryClient.setQueryData(["suppGlobFltr"], prm["param[search]"]);

      return await fetch(prm);
    },
    onSettled: async (mutRes: any) => {
      await queryClient.setQueryData(["suppPgntn"], {
        ...suppPgntn,
        page: 1,
        limit: mutRes.limit ?? 1,
      });
    },
  });

  const handleGlobFltrChange = (prm: string) => {
    if (suppPgntn) {
      pgntMut.mutate({
        ...suppPgntn,
        "param[search]": prm,
      });
    }
  };

  const table = useReactTable({
    data: suppData ? suppData?.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter: glbFltr,
      pagination: {
        pageIndex: Number(suppData?.page - 1),
        pageSize: suppData?.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobFltrChange,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: suppData?.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: true,
  });

  const handleResetFilter = async () => {
    if (suppPgntn) {
      pgntMut.mutate(initSuppReqPrm);
    }
  };

  const handleFirstPageClck = () => {
    if (suppPgntn) {
      pgntMut.mutate({
        ...suppPgntn,
        page: 0,
        limit: suppPgntn.limit,
      });
    }
  };

  const handleLastPageClck = () => {
    const lastPage = table.getPageCount();
    if (suppPgntn) {
      pgntMut.mutate({
        ...suppPgntn,
        page: lastPage,
        limit: suppPgntn.limit,
      });
    }
  };

  const handleNextClck = () => {
    const newPage = Number(suppData.page) + 1;
    if (suppPgntn) {
      pgntMut.mutate({
        ...suppPgntn,
        page: newPage,
        limit: suppPgntn.limit,
      });
    }
  };

  const handlePrevClck = () => {
    const newPage = Number(suppData.page) - 1;
    if (suppPgntn) {
      pgntMut.mutate({
        ...suppPgntn,
        page: newPage,
        limit: suppPgntn.limit,
      });
    }
  };

  const handlePageInputChange = (prm: number) => {
    if (suppPgntn) {
      queryClient.setQueryData(["suppPgntn"], {
        ...suppPgntn,
        page: Number(prm),
      });
      fetch({ ...suppPgntn, page: Number(prm) });
    }
  };

  const handlePageRowChange = async (prm: number) => {
    if (suppPgntn) {
      await pgntMut.mutate({
        ...suppPgntn,
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

export default useSupplierTable;
