import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { IItemCatGetReq } from "^/@types/models/itemcategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetItemCat from "./useGetItemCat";
import { useSession } from "next-auth/react";
import { initItemCatReqPrm } from "^/config/itemcategory/config";

const useItemCatTable = (columns: any) => {
  const { data: session } = useSession();

  const queryClient = useQueryClient();
  const itemCatPgntn = queryClient.getQueryData<IItemCatGetReq>([
    "itemCatPgntn",
  ]);
  const glbFltr = queryClient.getQueryData<any>(["itemCatGlobFltr"]);
  const itemCatData = queryClient.getQueryData<any>(["itemCat"]);

  const { fetchData } = useGetItemCat();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pgntMut = useMutation({
    mutationFn: async (prm: IItemCatGetReq) => {
      await queryClient.setQueryData(["itemCatGlobFltr"], prm["param[search]"]);

      return await fetchData(session, prm);
    },
    onSettled: async (mutRes: any) => {
      await queryClient.setQueryData(["itemCatPgntn"], {
        ...itemCatPgntn,
        page: 1,
        limit: mutRes.limit ?? 1,
      });
    },
  });

  const handleGlobFltrChange = (prm: string) => {
    if (itemCatPgntn) {
      pgntMut.mutate({
        ...itemCatPgntn,
        "param[search]": prm,
      });
    }
  };

  const table = useReactTable({
    data: itemCatData ? itemCatData?.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter: glbFltr,
      pagination: {
        pageIndex: Number(itemCatData?.page - 1),
        pageSize: itemCatData?.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobFltrChange,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: itemCatData?.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: true,
  });

  const handleResetFilter = async () => {
    if (itemCatPgntn) {
      pgntMut.mutate(initItemCatReqPrm);
    }
  };

  const handleFirstPageClck = () => {
    if (itemCatPgntn) {
      pgntMut.mutate({
        ...itemCatPgntn,
        page: 0,
        limit: itemCatPgntn.limit,
      });
    }
  };

  const handleLastPageClck = () => {
    const lastPage = table.getPageCount();
    if (itemCatPgntn) {
      pgntMut.mutate({
        ...itemCatPgntn,
        page: lastPage,
        limit: itemCatPgntn.limit,
      });
    }
  };

  const handleNextClck = () => {
    const newPage = Number(itemCatData.page) + 1;
    if (itemCatPgntn) {
      pgntMut.mutate({
        ...itemCatPgntn,
        page: newPage,
        limit: itemCatPgntn.limit,
      });
    }
  };

  const handlePrevClck = () => {
    const newPage = Number(itemCatData.page) - 1;
    if (itemCatPgntn) {
      pgntMut.mutate({
        ...itemCatPgntn,
        page: newPage,
        limit: itemCatPgntn.limit,
      });
    }
  };

  const handlePageInputChange = (prm: number) => {
    if (itemCatPgntn) {
      queryClient.setQueryData(["itemCatPgntn"], {
        ...itemCatPgntn,
        page: Number(prm),
      });
      fetchData(session, { ...itemCatPgntn, page: Number(prm) });
    }
  };

  const handlePageRowChange = async (prm: number) => {
    if (itemCatPgntn) {
      await pgntMut.mutate({
        ...itemCatPgntn,
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

export default useItemCatTable;
