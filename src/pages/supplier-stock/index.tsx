import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";
import { SUPPLIER_STOCK_HIST_PAGE } from "@/constants/pageURL";

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
import { bcData, initSuppStockReqPrm } from "^/config/supplier-stock/config";
import {
  ISupplierStockGetReq,
  SuppStockTanTblData,
} from "^/@types/models/supplierstock";
import useGetSupplierStock from "@/hooks/supplier-stock/useGetSupplierStock";
import { useSession } from "next-auth/react";

const SupplierStock = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.supplierStock")}`;

  const { data: session } = useSession();

  const {
    data: data,
    suppPgntn,
    reqPrm,
    suppStockDataLoading: loading,
    setReqPrm,
    fetchSuppStockData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  } = useGetSupplierStock();

  const columns = useMemo<ColumnDef<SuppStockTanTblData, any>[]>(
    () => [
      {
        accessorFn: (row) => `${row.suppName}`,
        id: "company",
        header: () => <CstmTstackHeaderCell str={t("Sidebar.supplier")} />,
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.itemName,
        id: "item",
        cell: (info: any) => info.getValue(),
        header: () => <CstmTstackHeaderCell str={t("Sidebar.item")} />,
        enableColumnFilter: false,
      },

      {
        accessorKey: "stock",
        header: () => <CstmTstackHeaderCell str={t("Sidebar.stock")} />,
        enableColumnFilter: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "action",
        cell: (info: any) => {
          const suppStockId = info.row.original.id;
          return (
            <div className="align-start flex justify-start">
              <CustomTableOptionMenu
                rowId={suppStockId}
                viewURL={`${SUPPLIER_STOCK_HIST_PAGE.ROOT}?suppStockId=${suppStockId}`}
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
    pageCount: suppPgntn.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: false,
  });

  useEffect(() => {
    if (debGlobFltr) {
      const payload: ISupplierStockGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      fetchSuppStockData(session, payload);
    }
  }, [debGlobFltr, fetchSuppStockData, reqPrm, session]);

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
    fetchSuppStockData(session, {
      ...initSuppStockReqPrm,
      page: 1,
      limit: reqPrm.limit,
    });
  };

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule addPageURL="" title={titlePage} bcumbs={bcData} />

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
                    fetchSuppStockData(session, newReqPrm);
                  }}
                  handleLastPageClick={() => {
                    const page = table.getPageCount();
                    const newReqPrm = {
                      ...reqPrm,
                      page,
                    };
                    table.setPageIndex(page);
                    setReqPrm(newReqPrm);
                    fetchSuppStockData(session, newReqPrm);
                  }}
                  handlePageInputChange={handlePageInputChange}
                  handlePageRowChange={(limit: number) => {
                    const newReqPrm: ISupplierStockGetReq = {
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

export default withAuth(SupplierStock);
