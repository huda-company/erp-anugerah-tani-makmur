import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData, initSuppReqPrm } from "^/config/supplier/config";
import Loading from "@/components/Loading";
import { DELIV_NOTE_PAGE, SUPPLIER_PAGE } from "@/constants/pageURL";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import useDebounce from "@/hooks/useDebounce";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { pageRowsArr } from "^/config/request/config";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import useGetDelivNote from "@/hooks/delivery-note/useGetDelivNote";
import { noop } from "lodash";
import {
  DelivNoteTanTblData,
  IDelivNoteGetReq,
} from "^/@types/models/deliverynote";
import { useSession } from "next-auth/react";
import { thsandSep } from "^/utils/helpers";
import { formatDate } from "^/utils/dateFormatting";

const DeliveryNotePage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.delivNote")}`;

  const { data: session, status } = useSession();

  const {
    data,
    delivNoteDataLoading: loading,
    suppPgntn,
    reqPrm,
    setReqPrm,
    fetchData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  } = useGetDelivNote();

  const columns = useMemo<ColumnDef<DelivNoteTanTblData, any>[]>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info: any) => formatDate(info.getValue()),
        header: () => <CstmTstackHeaderCell str={t("PurchasePage.date")} />,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.code,
        id: "code",
        cell: (info: any) => info.getValue(),
        header: () => <CstmTstackHeaderCell str={t("Common.code")} />,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.branchName}`,
        id: "branchName",
        header: () => (
          <CstmTstackHeaderCell
            str={`${t("Sidebar.branch")} ${t("Common.destination")}`}
          />
        ),
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.driverName}`,
        id: "driverName",
        header: () => (
          <CstmTstackHeaderCell str={`${t("PurchasePage.driverName")}`} />
        ),
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.purchaseTotal}`,
        id: "purchaseTotal",
        header: () => (
          <CstmTstackHeaderCell str={t("DelivNote.purchaseTotal")} />
        ),
        cell: (info) => thsandSep(Number(info.getValue())),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.sellingTotal,
        id: "sellingTotal",
        cell: (info: any) => thsandSep(Number(info.getValue())),
        header: () => (
          <CstmTstackHeaderCell str={t("DelivNote.sellingTotal")} />
        ),
        enableColumnFilter: false,
      },
      {
        accessorKey: "action",
        cell: (info: any) => {
          const suppId = info.row.original.id;
          return (
            <div className="align-start flex justify-start">
              <CustomTableOptionMenu
                rowId={suppId}
                editURL={`${DELIV_NOTE_PAGE.PAGE.EDIT}/${suppId}`}
                viewURL={`${DELIV_NOTE_PAGE.PAGE.VIEW}/${suppId}`}
                confirmDel={noop}
              />
            </div>
          );
        },
        header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
        enableColumnFilter: false,
      },
    ],
    [t]
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const debGlobFltr = useDebounce(globalFilter, 500); // Adjust delay as needed

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: pageRowsArr[0], //default page size
  });

  const table = useReactTable({
    data: data,
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
    pageCount: suppPgntn.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: false,
  });

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IDelivNoteGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      fetchData(session, payload);
    }
  }, [debGlobFltr, fetchData, reqPrm, session]);

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
    fetchData(session, {
      ...initSuppReqPrm,
      page: 1,
      limit: reqPrm.limit,
    });
  };

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule
              addPageURL={SUPPLIER_PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {status == "loading" || (loading && <Loading />)}

            {status == "authenticated" && loading == false && (
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
                    setReqPrm(newReqPrm);
                    fetchData(session, newReqPrm);
                  }}
                  handleLastPageClick={() => {
                    const page = table.getPageCount();
                    const newReqPrm = {
                      ...reqPrm,
                      page,
                    };
                    table.setPageIndex(page);
                    setReqPrm(newReqPrm);
                    fetchData(session, newReqPrm);
                  }}
                  handlePageInputChange={handlePageInputChange}
                  handlePageRowChange={(limit: number) => {
                    const newReqPrm: IDelivNoteGetReq = {
                      ...reqPrm,
                      limit,
                    };
                    table.setPageSize(limit);
                    setReqPrm(newReqPrm);
                    handlePageRowChange(limit);
                  }}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </DashboardLayout>
    </>
  );
};

export { getStaticProps };

export default withAuth(DeliveryNotePage);
