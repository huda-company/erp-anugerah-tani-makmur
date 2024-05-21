import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData, initSuppReqPrm } from "^/config/supplier/config";
import useGetSupplier from "@/hooks/supplier/useGetSupplier";
import Loading from "@/components/Loading";
import { SUPPLIER_PAGE } from "@/constants/pageURL";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ISupplierFieldRequest,
  SupplierTanTblData,
} from "^/@types/models/supplier";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import useDebounce from "@/hooks/useDebounce";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { pageRowsArr } from "^/config/request/config";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";

const Supplier = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.supplier")}`;

  const {
    loading,
    data: data,
    suppPgntn,
    reqPrm,
    setReqPrm,
    fetch,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
    confirmDeletion,
  } = useGetSupplier();

  const columns = useMemo<ColumnDef<SupplierTanTblData, any>[]>(
    () => [
      {
        accessorFn: (row) => `${row.supplierCode}`,
        id: "supplierCode",
        header: () => <CstmTstackHeaderCell str={t("Common.code")} />,
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.company}`,
        id: "company",
        header: () => <CstmTstackHeaderCell str={t("Signup.name")} />,
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.address,
        id: "address",
        cell: (info: any) => info.getValue(),
        header: () => <CstmTstackHeaderCell str={t("ParkingField.address")} />,
        enableColumnFilter: false,
      },

      {
        accessorKey: "tel",
        header: () => <CstmTstackHeaderCell str={t("Signup.phone")} />,
        enableColumnFilter: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "email",
        accessorFn: (row) => row.email,
        id: "email",
        header: () => <CstmTstackHeaderCell str={t("Signup.email")} />,
        cell: (info: any) => info.getValue(),
        enableColumnFilter: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "action",
        cell: (info: any) => {
          const suppId = info.row.original.id;
          return (
            <div className="align-center flex justify-center">
              <CustomTableOptionMenu
                rowId={suppId}
                editURL={`${SUPPLIER_PAGE.EDIT}/${suppId}`}
                viewURL={`${SUPPLIER_PAGE.VIEW}/${suppId}`}
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
      const payload: ISupplierFieldRequest["query"] = {
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
                    const newReqPrm: ISupplierFieldRequest["query"] = {
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

export default withAuth(Supplier);
