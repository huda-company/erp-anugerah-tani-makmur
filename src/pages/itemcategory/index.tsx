import React from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData } from "^/config/itemcategory/config";
import Loading from "@/components/Loading";
import useGetItemCat from "@/hooks/itemCategory/useGetItemCat";

import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { ITEM_CAT } from "@/constants/pageURL";
import useItemCatTableColumn from "@/hooks/itemCategory/useItemCatTableColumn";
import useItemCatTable from "@/hooks/itemCategory/useItemCatTable";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

const ItemCategory = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.itemCategory")}`;
  const { status } = useSession();

  const queryClient = useQueryClient();
  const glbFltr = queryClient.getQueryData<any>(["itemCatGlobFltr"]);

  const {
    itemCatData,
    itemCatDataLoading: loading,
    confirmDeletion,
  } = useGetItemCat();

  const columns = useItemCatTableColumn(confirmDeletion);

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
  } = useItemCatTable(columns);

  return (
    <>
      {(status == "loading" || loading) && <Loading />}
      {status == "authenticated" && !loading && (
        <DashboardLayout>
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 md:p-8">
              <HeaderModule
                addPageURL={ITEM_CAT.PAGE.ADD}
                title={titlePage}
                bcumbs={bcData}
              />

              {loading && <Loading />}

              {status == "authenticated" && loading == false && (
                <div className="border-bg-[#CAF4AB] my-[1rem] rounded-[1rem] border-2 p-4">
                  <CstmTstackTable
                    columns={columns}
                    data={itemCatData.items}
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
      )}
    </>
  );
};

export { getStaticProps };

export default withAuth(ItemCategory);
