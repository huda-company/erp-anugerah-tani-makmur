import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";
import useGetUser from "@/hooks/user/useGetUser";
import { bcData } from "^/config/user/config";
import { AUTH_PAGE_URL, USER } from "@/constants/pageURL";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IUserGetReq, UserResp } from "^/@types/models/user";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import useDebounce from "@/hooks/useDebounce";
import { pageRowsArr } from "^/config/request/config";
import { OptMenuItem } from "@/components/CustomTable/types";
import { capitalizeStr } from "^/utils/capitalizeStr";

const UserPage = () => {
  const router = useRouter();

  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

  const { status, data: session } = useSession();

  const t = useTranslations("");
  const titlePage = `${t("Sidebar.user")}`;

  const {
    userDataLoading: loading,
    userData,
    reqPrm,
    fetchData,
    handleSetReqPrm,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
    confirmDeletion,
  } = useGetUser();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debGlobFltr = useDebounce(globalFilter, 500); // Adjust delay as needed

  const [pagination, setPagination] = useState({
    pageIndex: Number(reqPrm.page) || 0, //initial page index
    pageSize: Number(reqPrm.limit) || pageRowsArr[2], //default page size
  });

  const columns = useMemo<ColumnDef<UserResp, any>[]>(
    () => [
      {
        accessorFn: (row) => `${row.name}`,
        id: "name",
        header: () => <CstmTstackHeaderCell str={t("Signup.name")} />,
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.email}`,
        accessorKey: "email",
        header: () => <CstmTstackHeaderCell str={t("UserPage.email")} />,
        enableColumnFilter: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorFn: (row) => `${row.enabled}`,
        accessorKey: "active",
        header: () => <CstmTstackHeaderCell str={t("UserPage.isActive")} />,
        enableColumnFilter: false,
        cell: (info) => (info.getValue() ? "active" : "inactive"),
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "action",
        cell: (info: any) => {
          const usrId = info.row.original.id;

          const optItem: OptMenuItem[] = [
            {
              label: capitalizeStr(t("Common.view")),
              url: `${USER.PAGE.VIEW}/${usrId}`,
              show: true,
              doAction: () => router.push(`${USER.PAGE.VIEW}/${usrId}` ?? "#"),
            },
            {
              label: capitalizeStr(t("Common.edit")),
              url: `${USER.PAGE.EDIT}/${usrId}`,
              show: true,
              doAction: () => router.push(`${USER.PAGE.EDIT}/${usrId}` ?? "#"),
            },
            {
              label: capitalizeStr(t("Common.delete")),
              url: "#",
              show: true,
              doAction: () => confirmDeletion(usrId),
            },
          ];

          return (
            <div className="align-start flex justify-start">
              <CustomTableOptionMenu rowId={usrId} item={optItem} />
            </div>
          );
        },
        header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
        enableColumnFilter: false,
      },
    ],
    [confirmDeletion, t]
  );

  const data = userData ? userData.items : [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true,
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    enableFilters: true,
    enableColumnFilters: true,
    manualPagination: true, //turn off client-side pagination
    pageCount: reqPrm.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: false,
  });

  const handleResetFilter = () => {
    setGlobalFilter("");
    fetchData(session, {
      ...reqPrm,
      page: 1,
      limit: reqPrm.limit,
    });
  };

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

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IUserGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      fetchData(session, payload);
    }
  }, [debGlobFltr, fetchData, reqPrm, session]);

  return (
    <>
      {status == "loading" || (loading && <Loading />)}

      {status == "authenticated" && !loading && (
        <DashboardLayout>
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 md:p-8">
              <HeaderModule
                addPageURL={USER.PAGE.ADD}
                title={titlePage}
                bcumbs={bcData}
              />

              {loading == false && (
                <div className="border-bg-[#CAF4AB] my-[1rem] rounded-[1rem] border-2 p-4">
                  <CstmTstackTable
                    columns={columns}
                    data={data}
                    handleResetFilter={handleResetFilter}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />

                  <CstmTstackPagination
                    table={table}
                    handlePrevClick={() => {
                      handlePrevClck();
                      handlePrevPgnt();
                    }}
                    handleNextClick={() => {
                      handleNextClck();
                      handleNextPgnt();
                    }}
                    handleFirstPageClick={() => {
                      table.setPageIndex(0);
                      const newReqPrm = {
                        ...reqPrm,
                        page: 0,
                      };
                      handleSetReqPrm(newReqPrm);
                      fetchData(session, newReqPrm);
                    }}
                    handleLastPageClick={() => {
                      const page = table.getPageCount();
                      const newReqPrm = {
                        ...reqPrm,
                        page,
                      };
                      table.setPageIndex(page);
                      handleSetReqPrm(newReqPrm);
                      fetchData(session, newReqPrm);
                    }}
                    handlePageInputChange={handlePageInputChange}
                    handlePageRowChange={(limit: number) => {
                      const newReqPrm: IUserGetReq = {
                        ...reqPrm,
                        limit,
                      };
                      table.setPageSize(limit);
                      handleSetReqPrm(newReqPrm);
                      handlePageRowChange(limit);
                    }}
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </DashboardLayout>
      )}
    </>
  );
};

export { getStaticProps };

export default withAuth(UserPage);
