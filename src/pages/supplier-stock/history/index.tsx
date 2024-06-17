import DashboardLayout from "@/components/DashboardLayout";
import { getStaticProps } from "^/utils/getStaticProps";
import { withAuth } from "^/utils/withAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { useTranslations } from "next-intl";
import {
  bcDataSuppStockHist,
  initSuppStockHistReqPrm,
} from "^/config/supplier-stock/config";
import {
  ISupplierStockHistGetReq,
  SuppStockHistTanTblData,
} from "^/@types/models/supplierstockhist";
import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import useDebounce from "@/hooks/useDebounce";
import { pageRowsArr } from "^/config/request/config";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import useGetSupplierStock from "@/hooks/supplier-stock/useGetSupplierStock";
import { useRouter } from "next/router";
import Typography from "@/components/Typography";
import { useSession } from "next-auth/react";
import useGetSuppStockHistBySuppStockId from "@/hooks/supplier-stock-hist/useGetSuppStockHistBySuppStockId";

const SuppStockHistPage = () => {
  const t = useTranslations("");

  const { data: session } = useSession();

  const router = useRouter();
  const { suppStockId } = router.query;

  const titlePage = `${t("Sidebar.supplierStockHist")}`;

  const {
    data,
    historyLoading: loading,
    histPgntn,
    reqPrm,
    fetchSuppStockHistData,
    setReqPrm,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  } = useGetSuppStockHistBySuppStockId();

  const { suppStockData } = useGetSupplierStock();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debGlobFltr = useDebounce(globalFilter, 500); // Adjust delay as needed

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: pageRowsArr[0], //default page size
  });

  const columns = useMemo<ColumnDef<SuppStockHistTanTblData, any>[]>(
    () => [
      {
        accessorFn: (row) => row.date,
        id: "date",
        cell: (info: any) => info.getValue(),
        header: () => <CstmTstackHeaderCell str={t("Common.date")} />,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.type}`,
        id: "type",
        header: () => <CstmTstackHeaderCell str={t("SuppStock.activity")} />,
        cell: (info: any) => {
          const poNo = info.row.original.poNo;
          return `${info.getValue()}  # ${poNo}`;
        },
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.number,
        id: "number",
        cell: (info: any) => info.getValue(),
        header: () => <CstmTstackHeaderCell str={t("Common.amount")} />,
        enableColumnFilter: false,
      },
      {
        accessorKey: "action",
        cell: (info: any) => {
          const poId = info.row.original.poId;
          return (
            <div className="align-center flex justify-center">
              <CustomTableOptionMenu
                rowId={poId}
                viewURL={`${PURCHASE_PAGE.VIEW}/${poId}`}
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
    pageCount: histPgntn.totalPages, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    debugTable: true,
    debugHeaders: false,
    debugColumns: false,
    debugRows: false,
  });

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
    fetchSuppStockHistData(session, {
      ...initSuppStockHistReqPrm,
      page: 1,
      limit: reqPrm.limit,
    });
  };

  useEffect(() => {
    if (suppStockId) {
      const newReqPrm = {
        ...reqPrm,
        "param[suppStockId]": String(suppStockId),
      };
      setReqPrm(newReqPrm);
    }
  }, [suppStockId]);

  useEffect(() => {
    fetchSuppStockHistData(session, {
      ...reqPrm,
      "param[search]": debGlobFltr,
    });
  }, [debGlobFltr]);

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule
              addPageURL=""
              title={titlePage}
              bcumbs={bcDataSuppStockHist}
            />

            <Typography className="text-xl font-bold text-black ">
              {suppStockData ? suppStockData[0].supplier.company : "--"}
              <br />
              <br />
              {suppStockData ? `${suppStockData[0].item.name}` : "--"} :{" "}
              {suppStockData ? `${suppStockData[0].stock}` : "0"}
            </Typography>

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
                    fetchSuppStockHistData(session, newReqPrm);
                  }}
                  handleLastPageClick={() => {
                    const page = table.getPageCount();
                    const newReqPrm = {
                      ...reqPrm,
                      page,
                    };
                    table.setPageIndex(page);
                    setReqPrm(newReqPrm);
                    fetchSuppStockHistData(session, newReqPrm);
                  }}
                  handlePageInputChange={handlePageInputChange}
                  handlePageRowChange={(limit: number) => {
                    const newReqPrm: ISupplierStockHistGetReq = {
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

export default withAuth(SuppStockHistPage);
