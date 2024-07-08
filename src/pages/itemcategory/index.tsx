import React, { useEffect } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData, initItemCatReqPrm } from "^/config/itemcategory/config";
import Loading from "@/components/Loading";
import useGetItemCat from "@/hooks/itemCategory/useGetItemCat";

import { IItemCatGetReq } from "^/@types/models/itemcategory";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { ITEM_CAT } from "@/constants/pageURL";
import useItemCatTableColumn from "@/hooks/itemCategory/useItemCatTableColumn";
import useItemCatTable from "@/hooks/itemCategory/useItemCatTable";
import { useSession } from "next-auth/react";

const ItemCategory = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.itemCategory")}`;
  const { status } = useSession();

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

  const columns = useItemCatTableColumn(confirmDeletion);

  const {
    table,
    globalFilter,
    debGlobFltr,
    setGlobalFilter,
    handleNextPgnt,
    handlePrevPgnt,
  } = useItemCatTable(data, columns, itemCatPgntn);

  useEffect(() => {
    if (debGlobFltr) {
      const payload: IItemCatGetReq = {
        ...reqPrm,
        "param[search]": debGlobFltr,
      };
      setReqPrm(payload);
      fetch(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debGlobFltr, reqPrm.page, reqPrm.limit]);

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
              addPageURL={ITEM_CAT.PAGE.ADD}
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

export default withAuth(ItemCategory);
