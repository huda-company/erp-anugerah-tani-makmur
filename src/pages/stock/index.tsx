import React, { useEffect } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";

import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { bcData } from "^/config/supplier-stock/config";
import { useSession } from "next-auth/react";
import useGetStock from "@/hooks/stock/useGetStock";
import useStockTableColumn from "@/hooks/stock/useStockTableColumn";
import { noop } from "lodash";
import useStockTable from "@/hooks/stock/useStockTable";
import { IStockGetReq } from "^/@types/models/stock";

const StockPage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.stock")}`;

  const { status, data: session } = useSession();

  const {
    data: data,
    stockPgntn,
    reqPrm,
    stockDataLoading: loading,
    setReqPrm,
    fetchStockData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  } = useGetStock();

  const columns = useStockTableColumn(noop);

  const {
    table,
    globalFilter,
    debGlobFltr,
    setGlobalFilter,
    handleNextPgnt,
    handlePrevPgnt,
    handleResetFilter,
  } = useStockTable(data, columns, stockPgntn);

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IStockGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      setReqPrm(payload);
      fetchStockData(session, payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debGlobFltr, reqPrm.page, reqPrm.limit]);

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule addPageURL="" title={titlePage} bcumbs={bcData} />

            {status == "loading" || (loading && <Loading />)}

            {status == "authenticated" && !loading && (
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
                    fetchStockData(session, newReqPrm);
                  }}
                  handleLastPageClick={() => {
                    const page = table.getPageCount();
                    const newReqPrm = {
                      ...reqPrm,
                      page,
                    };
                    table.setPageIndex(page);
                    setReqPrm(newReqPrm);
                    fetchStockData(session, newReqPrm);
                  }}
                  handlePageInputChange={handlePageInputChange}
                  handlePageRowChange={(limit: number) => {
                    table.setPageSize(limit);
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

export default withAuth(StockPage);
