import React from "react";

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
import useGetCashflow from "@/hooks/cashflow/useGetCashflow";
import useCashflowTableColumn from "@/hooks/cashflow/useCashflowTableColumn";
import useCashflowTable from "@/hooks/cashflow/useCashflowTable";
import { noop } from "lodash";
import { useQueryClient } from "@tanstack/react-query";

const CashflowPage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.cashflow")}`;

  const queryClient = useQueryClient();
  const glbFltr = queryClient.getQueryData<any>(["cflGlobFltr"]);

  const { status } = useSession();

  const { cflDataLoading: loading, data, reqPrmLoading } = useGetCashflow();

  const columns = useCashflowTableColumn(noop);

  const {
    table,
    handleGlobFltrChange,
    handleResetFilter,
    handleFirstPageClck,
    handleLastPageClck,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  } = useCashflowTable(columns);

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule addPageURL="" title={titlePage} bcumbs={bcData} />

            {(loading || status == "loading" || reqPrmLoading) && <Loading />}

            {!loading && !reqPrmLoading && status == "authenticated" && (
              <div className="border-bg-[#CAF4AB] my-[1rem] rounded-[1rem] border-2 p-4">
                <CstmTstackTable
                  columns={columns}
                  data={data}
                  handleResetFilter={handleResetFilter}
                  globalFilter={glbFltr}
                  handleGlobFltrchange={handleGlobFltrChange}
                />

                <CstmTstackPagination
                  table={table}
                  handlePrevClick={handlePrevClck}
                  handleNextClick={handleNextClck}
                  handleFirstPageClick={handleFirstPageClck}
                  handleLastPageClick={handleLastPageClck}
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

export default withAuth(CashflowPage);
