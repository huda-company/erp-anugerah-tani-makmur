import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { initItemReqPrm } from "^/config/item/config";
import { IUserGetReq } from "^/@types/models/user";
import useGetUser from "./useGetUser";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUserTable = (columns: any) => {
  const queryClient = useQueryClient();
  const usrPgntn = queryClient.getQueryData<IUserGetReq>(["usrPgntn"]);
  const glbFltr = queryClient.getQueryData<any>(["usrGlobFltr"]);
  const usrData = queryClient.getQueryData<any>(["user"]);

  const { data: session } = useSession();

  const { fetchData } = useGetUser();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pgntMut = useMutation({
    mutationFn: async (prm: IUserGetReq) => {
      await queryClient.setQueryData(["usrGlobFltr"], prm["param[search]"]);

      return await fetchData(session, prm);
    },
    onSettled: async (mutRes: any) => {
      await queryClient.setQueryData(["usrPgntn"], {
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
    data: usrData ? usrData?.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter: glbFltr,
      pagination: {
        pageIndex: Number(usrData?.page - 1),
        pageSize: usrData?.limit,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobFltrChange,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: usrData?.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: true,
  });

  const handleResetFilter = async () => {
    if (usrPgntn) {
      pgntMut.mutate(initItemReqPrm);
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
    const newPage = Number(usrData.page) + 1;
    if (usrPgntn) {
      pgntMut.mutate({
        ...usrPgntn,
        page: newPage,
        limit: usrPgntn.limit,
      });
    }
  };

  const handlePrevClck = () => {
    const newPage = Number(usrData.page) - 1;
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
      fetchData(session, { ...usrPgntn, page: Number(prm) });
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

export default useUserTable;
