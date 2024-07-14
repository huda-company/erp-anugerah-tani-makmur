import React from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";
import useGetBranch from "@/hooks/branch/useGetBranch";
import { bcData } from "^/config/branch/config";

import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { BRANCH } from "@/constants/pageURL";
import useBranchTableColumn from "@/hooks/branch/useBranchTableColumn";
import useBranchTable from "@/hooks/branch/useBranchTable";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

const BranchPage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.branch")}`;

  const { status } = useSession();

  const queryClient = useQueryClient();
  const glbFltr = queryClient.getQueryData<any>(["bchGlobFltr"]);

  const { bchDataLoading: loading, bchData, confirmDeletion } = useGetBranch();

  const columns = useBranchTableColumn(confirmDeletion);

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
  } = useBranchTable(columns);

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule
              addPageURL={BRANCH.PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {loading || (status == "loading" && <Loading />)}

            {loading == false && status == "authenticated" && (
              <div className="border-bg-[#CAF4AB] my-[1rem] rounded-[1rem] border-2 p-4">
                <CstmTstackTable
                  columns={columns}
                  data={bchData.items}
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

export default withAuth(BranchPage);
