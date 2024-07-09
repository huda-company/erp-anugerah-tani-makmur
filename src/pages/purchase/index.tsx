import React, { useEffect } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";
import { PO } from "@/constants/pageURL";
import { bcData } from "^/config/purchase/config";
import useGetPurchase from "@/hooks/purchase/useGetPurchase";

import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import usePurchTableColumn from "@/hooks/purchase/usePurchTableColumn";
import usePurchTable from "@/hooks/purchase/usePurchTable";
import { IPurchGetReq } from "^/@types/models/purchase";

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
    confirmDeletion,
  } = useGetPurchase();

  const columns = usePurchTableColumn(confirmDeletion);

  const {
    table,
    globalFilter,
    debGlobFltr,
    setGlobalFilter,
    handleNextPgnt,
    handlePrevPgnt,
    handleResetFilter,
  } = usePurchTable(data, columns, purchPgntn);

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IPurchGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      setReqPrm(payload);
      fetch(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debGlobFltr, reqPrm.page, reqPrm.limit]);

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule
              addPageURL={PO.PAGE.ADD}
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

export default withAuth(PurchasePage);
