import React from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import Loading from "@/components/Loading";
import useGetUser from "@/hooks/user/useGetUser";
import { bcData } from "^/config/user/config";
import { AUTH_PAGE_URL, USER } from "@/constants/pageURL";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CstmTstackTable from "@/components/CustomTstackTable/CstmTstackTable";
import CstmTstackPagination from "@/components/CustomTstackTable/CstmTstackPagination";

import useUserTable from "@/hooks/user/useUserTable";
import useUserTableColumn from "@/hooks/user/useUserTableColumn";
import { useQueryClient } from "@tanstack/react-query";

const UserPage = () => {
  const router = useRouter();

  const queryClient = useQueryClient();
  const glbFltr = queryClient.getQueryData<any>(["usrGlobFltr"]);

  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

  const { status } = useSession();

  const t = useTranslations("");
  const titlePage = `${t("Sidebar.user")}`;

  const {
    userDataLoading: loading,
    userData,
    reqPrmLoading,
    confirmDeletion,
  } = useGetUser();

  const columns = useUserTableColumn(confirmDeletion);

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
  } = useUserTable(columns);

  return (
    <>
      {(status == "loading" || reqPrmLoading || loading) && <Loading />}

      {status == "authenticated" && !loading && (
        <DashboardLayout>
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 md:p-8">
              <HeaderModule
                addPageURL={USER.PAGE.ADD}
                title={titlePage}
                bcumbs={bcData}
              />

              {!loading && (
                <div className="border-bg-[#CAF4AB] my-[1rem] rounded-[1rem] border-2 p-4">
                  <CstmTstackTable
                    columns={columns}
                    data={userData.items}
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

export default withAuth(UserPage);
