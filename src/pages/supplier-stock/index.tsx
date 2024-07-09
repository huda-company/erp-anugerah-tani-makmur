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
import { ISupplierStockGetReq } from "^/@types/models/supplierstock";
import useGetSupplierStock from "@/hooks/supplier-stock/useGetSupplierStock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSuppStockTableColumn from "@/hooks/supplier-stock/useSuppStockTableColumn";
import { noop } from "lodash";
import useSuppStockTable from "@/hooks/supplier-stock/useSuppStockTable";

const SupplierStock = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.supplierStock")}`;

  const router = useRouter();

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

  const columns = useSuppStockTableColumn(noop);

  const {
    table,
    globalFilter,
    debGlobFltr,
    setGlobalFilter,
    handleNextPgnt,
    handlePrevPgnt,
    handleResetFilter,
  } = useSuppStockTable(data, columns, suppPgntn);

  useEffect(() => {
    if (debGlobFltr) {
      const payload: ISupplierStockGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      setReqPrm(payload);
      fetchSuppStockData(session, payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debGlobFltr, reqPrm.page, reqPrm.limit]);

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
