import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData, initItemCatReqPrm } from "^/config/itemcategory/config";
import Loading from "@/components/Loading";
import { ITEM_CAT_PAGE } from "@/constants/pageURL";
import useGetItemCat from "@/hooks/itemCategory/useGetItemCat";
import { capitalizeStr } from "^/utils/capitalizeStr";
import useDebounce from "@/hooks/useDebounce";
import { pageRowsArr } from "@/components/PaginationCustom/config";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IItemCatFieldRequest,
  IItemCatForm,
} from "^/@types/models/itemcategory";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";

const ItemCategory = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.itemCategory")}`;

  const {
    loading,
    data,
    reqPrm,
    setReqPrm,
    itemCatPgntn,
    fetch,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
    confirmDeletion,
  } = useGetItemCat();

  const columns = useMemo<ColumnDef<IItemCatForm, any>[]>(
    () => [
      {
        accessorFn: (row) => `${row.name}`,
        id: "name",
        header: t("Signup.name"),
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.description}`,
        id: "description",
        header: t("Index.description"),
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "action",
        cell: (info: any) => {
          const itemCatId = info.row.original.id;
          return (
            <div className="align-center flex justify-center">
              <CustomTableOptionMenu
                rowId={itemCatId}
                editURL={`${ITEM_CAT_PAGE.EDIT}/${itemCatId}`}
                viewURL={`${ITEM_CAT_PAGE.VIEW}/${itemCatId}`}
                confirmDel={confirmDeletion}
              />
            </div>
          );
        },
        header: () => <span>{capitalizeStr(t("Common.action"))}</span>,
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
    pageCount: itemCatPgntn.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: false,
  });

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IItemCatFieldRequest["query"] = {
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
      ...initItemCatReqPrm,
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
              addPageURL={ITEM_CAT_PAGE.ADD}
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
                    const newReqPrm: IItemCatFieldRequest["query"] = {
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

export default withAuth(ItemCategory);
