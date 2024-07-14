import React from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData, initSuppReqPrm } from "^/config/supplier/config";
import useGetSupplier from "@/hooks/supplier/useGetSupplier";
import Loading from "@/components/Loading";

import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";
import { SUPPLIER } from "@/constants/pageURL";
import useSupplierTableColumn from "@/hooks/supplier/useSupplierTableColumn";
import useSupplierTable from "@/hooks/supplier/useSupplierTable";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useMount from "@/hooks/useMount";

const Supplier = () => {
  const { status } = useSession();

  const t = useTranslations("");
  const titlePage = `${t("Sidebar.supplier")}`;

  const queryClient = useQueryClient();
  const glbFltr = queryClient.getQueryData<any>(["suppGlobFltr"]);

  const {
    suppDataLoading: loading,
    suppData,
    confirmDeletion,
  } = useGetSupplier();

  const columns = useSupplierTableColumn(confirmDeletion);

  const {
    table,
    pgntMut,
    handleGlobFltrChange,
    handleResetFilter,
    handleFirstPageClck,
    handleLastPageClck,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  } = useSupplierTable(columns);

  useMount(() => {
    pgntMut.mutate(initSuppReqPrm);
  });

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

            {(loading || status == "loading") && <Loading />}

            {!loading && status == "authenticated" && (
              <div className="border-bg-[#CAF4AB] my-[1rem] rounded-[1rem] border-2 p-4">
                <CstmTstackTable
                  columns={columns}
                  data={suppData.items}
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

export default withAuth(Supplier);
