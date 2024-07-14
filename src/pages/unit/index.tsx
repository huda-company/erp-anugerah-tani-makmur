import React from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";
import useGetUnit from "@/hooks/unit/useGetUnit";
import { bcData } from "^/config/unit/config";

import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { UNIT } from "@/constants/pageURL";
import useUnitTable from "@/hooks/unit/useUnitTable";
import useUnitTableColumn from "@/hooks/unit/useUnitTableColumn";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useMount from "@/hooks/useMount";
import { initSuppReqPrm } from "^/config/supplier/config";

const UnitPage = () => {
  const { status } = useSession();

  const t = useTranslations("");
  const titlePage = `${t("Sidebar.unit")}`;

  const queryClient = useQueryClient();
  const glbFltr = queryClient.getQueryData<any>(["usrGlobFltr"]);

  const { unitDataLoading: loading, unitData, confirmDeletion } = useGetUnit();

  const columns = useUnitTableColumn(confirmDeletion);

  const { pgntMut } = useUnitTable(columns);

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
  } = useUnitTable(columns);

  useMount(() => {
    pgntMut.mutate(initSuppReqPrm);
  });

  return (
    <>
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule
              addPageURL={UNIT.PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {(loading || status == "loading") && <Loading />}

            {!loading && (
              <div className="border-bg-[#CAF4AB] my-[1rem] rounded-[1rem] border-2 p-4">
                <CstmTstackTable
                  columns={columns}
                  data={unitData.items}
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

export default withAuth(UnitPage);
