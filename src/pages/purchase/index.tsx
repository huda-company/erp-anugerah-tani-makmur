import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { bcData } from "^/config/purchase/config";
import useGetPurchase from "@/hooks/purchase/useGetPurchase";
import { IPurchaseFieldRequest, PurchTanTblData } from "^/@types/models/purchase";
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import useDebounce from "@/hooks/useDebounce";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import { formatDate } from "^/utils/dateFormatting";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";

const PurchasePage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.purchaseOrder")}`;

  const {
    loading,
    data,
    purchPgntn,
    reqPrm,
    setReqPrm,
    fetch,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
    confirmDeletion
  } = useGetPurchase();

  const columns = useMemo<ColumnDef<PurchTanTblData, any>[]>(
    () => [
      {
        accessorFn: (row) => `${row.poNo}`,
        id: "poNo",
        header: () => <CstmTstackHeaderCell str={t("PurchasePage.poNo")} />,
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.supplierName,
        id: "supplier",
        cell: (info: any) => info.getValue(),
        header: () => <CstmTstackHeaderCell str={t("Sidebar.supplier")} />,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.expDate}`,
        accessorKey: "expDate",
        header: () => <CstmTstackHeaderCell str={t("PurchasePage.expDate")} />,
        cell: (info: any) => formatDate(info.getValue()),
        enableColumnFilter: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorFn: (row) => `${row.year}`,
        accessorKey: "year",
        header: () => <CstmTstackHeaderCell str={t("PurchasePage.year")} />,
        enableColumnFilter: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorFn: (row) => `${row.status}`,
        accessorKey: "status",
        header: () => <CstmTstackHeaderCell str={t("PurchasePage.status")} />,
        enableColumnFilter: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "action",
        cell: (info: any) => {
          const branchId = info.row.original.id;
          return (
            <div className="align-center flex justify-center">
              <CustomTableOptionMenu
                rowId={branchId}
                editURL={`${PURCHASE_PAGE.EDIT}/${branchId}`}
                viewURL={`${PURCHASE_PAGE.VIEW}/${branchId}`}
                confirmDel={confirmDeletion}
              />
            </div>
          );
        },
        header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
        enableColumnFilter: false,
      },
    ],
    [confirmDeletion, t]
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const debGlobFltr = useDebounce(globalFilter, 500); // Adjust delay as needed

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: Number(reqPrm.limit), //default page size
  });

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
    pageCount: purchPgntn.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: false,
  });

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IPurchaseFieldRequest["query"] = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      fetch(payload);
    }
  }, [debGlobFltr, fetch, reqPrm]);

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
    fetch({
      ...reqPrm,
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
              addPageURL={PURCHASE_PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {loading && <Loading />}

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
                    setReqPrm(newReqPrm);
                    fetch(newReqPrm);
                  }}
                  handleLastPageClick={() => {
                    const page = table.getPageCount();
                    const newReqPrm = {
                      ...reqPrm,
                      page,
                    };
                    table.setPageIndex(page);
                    setReqPrm(newReqPrm);
                    fetch(newReqPrm);
                  }}
                  handlePageInputChange={handlePageInputChange}
                  handlePageRowChange={(limit: number) => {
                    const newReqPrm: IPurchaseFieldRequest["query"] = {
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

export default withAuth(PurchasePage);
