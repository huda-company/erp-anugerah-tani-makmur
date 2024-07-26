import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { initSuppReqPrm } from "^/config/supplier/config";
import useGetDelivNote from "./useGetDelivNote";
import { IDelivNoteGetReq } from "^/@types/models/deliverynote";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useDelivNoteTable = (columns: any) => {
  const { data: session } = useSession();

  const queryClient = useQueryClient();
  const delivNotePgntn = queryClient.getQueryData<IDelivNoteGetReq>([
    "delivNotePgntn",
  ]);
  const glbFltr = queryClient.getQueryData<any>(["delivNoteGlobFltr"]);
  const delivNoteData = queryClient.getQueryData<any>(["delivNote"]);

  const { fetchData } = useGetDelivNote();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pgntMut = useMutation({
    mutationFn: async (prm: IDelivNoteGetReq) => {
      await queryClient.setQueryData(
        ["delivNoteGlobFltr"],
        prm["param[search]"]
      );

      return await fetchData(session, prm);
    },
    onSettled: async (mutRes: any) => {
      await queryClient.setQueryData(["delivNotePgntn"], {
        ...delivNotePgntn,
        page: 1,
        limit: mutRes.limit ?? 1,
      });
    },
  });

  const handleGlobFltrChange = (prm: string) => {
    if (delivNotePgntn) {
      pgntMut.mutate({
        ...delivNotePgntn,
        "param[search]": prm,
      });
    }
  };

  const table = useReactTable({
    data: delivNoteData ? delivNoteData?.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter: glbFltr,
      pagination: {
        pageIndex: Number(delivNoteData?.page - 1),
        pageSize: delivNoteData?.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobFltrChange,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: delivNoteData?.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: true,
  });
  const handleResetFilter = async () => {
    if (delivNotePgntn) {
      pgntMut.mutate(initSuppReqPrm);
    }
  };

  const handleFirstPageClck = () => {
    if (delivNotePgntn) {
      pgntMut.mutate({
        ...delivNotePgntn,
        page: 0,
        limit: delivNotePgntn.limit,
      });
    }
  };

  const handleLastPageClck = () => {
    const lastPage = table.getPageCount();
    if (delivNotePgntn) {
      pgntMut.mutate({
        ...delivNotePgntn,
        page: lastPage,
        limit: delivNotePgntn.limit,
      });
    }
  };

  const handleNextClck = () => {
    const newPage = Number(delivNoteData.page) + 1;
    if (delivNotePgntn) {
      pgntMut.mutate({
        ...delivNotePgntn,
        page: newPage,
        limit: delivNotePgntn.limit,
      });
    }
  };

  const handlePrevClck = () => {
    const newPage = Number(delivNoteData.page) - 1;
    if (delivNotePgntn) {
      pgntMut.mutate({
        ...delivNotePgntn,
        page: newPage,
        limit: delivNotePgntn.limit,
      });
    }
  };

  const handlePageInputChange = (prm: number) => {
    if (delivNotePgntn) {
      queryClient.setQueryData(["delivNotePgntn"], {
        ...delivNotePgntn,
        page: Number(prm),
      });
      fetchData(session, { ...delivNotePgntn, page: Number(prm) });
    }
  };

  const handlePageRowChange = async (prm: number) => {
    if (delivNotePgntn) {
      await pgntMut.mutate({
        ...delivNotePgntn,
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

export default useDelivNoteTable;
