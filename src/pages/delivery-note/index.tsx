import React, { useEffect } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData } from "^/config/supplier/config";
import Loading from "@/components/Loading";

import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import useGetDelivNote from "@/hooks/delivery-note/useGetDelivNote";
import { IDelivNoteGetReq } from "^/@types/models/deliverynote";
import { useSession } from "next-auth/react";
import { SUPPLIER } from "@/constants/pageURL";
import useDelivNoteTableColumn from "@/hooks/delivery-note/useDelivNoteTableColumn";
import useDelivNoteTable from "@/hooks/delivery-note/useDelivNoteTable";

const DeliveryNotePage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.delivNote")}`;

  const { status, data: session } = useSession();

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
    confirmDeletion,
  } = useGetDelivNote();

  const columns = useDelivNoteTableColumn(confirmDeletion);

  const {
    table,
    globalFilter,
    debGlobFltr,
    setGlobalFilter,
    handleNextPgnt,
    handlePrevPgnt,
    handleResetFilter,
  } = useDelivNoteTable(data, columns, suppPgntn);

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IDelivNoteGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      setReqPrm(payload);
      fetchData(session, payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debGlobFltr, reqPrm.page, reqPrm.limit]);

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule
              addPageURL={SUPPLIER.PAGE.ADD}
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
