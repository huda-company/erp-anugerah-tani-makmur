import React, { useMemo } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import CustomTable from "@/components/CustomTable/CustomTable";
import { CustomTblData } from "@/components/CustomTable/types";
import Loading from "@/components/Loading";
import { capitalizeStr } from "^/utils/capitalizeStr";
import PaginationCustom from "@/components/PaginationCustom/PaginationCustom";
import useGetUser from "@/hooks/user/useGetUser";
import { bcData } from "^/config/user/config";
import { AUTH_PAGE_URL, USER } from "@/constants/pageURL";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
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
    tblBd,
    userPgntn,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  } = useGetUser();

  const header = useMemo(
    () => [
      {
        value: t("Signup.name"),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: t("UserPage.email"),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: t("Signup.phone"),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: t("Signup.birthDate"),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: t("UserPage.isActive"),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("Common.action")),
        className: "sticky right-0 z-20 text-left text-xs w-[3rem]",
      },
    ],
    [t]
  );

  const tblData: CustomTblData = useMemo(
    () => ({
      header: header,
      body: tblBd,
    }),
    [header, tblBd]
  );

  return (
    <>
      {status == "loading" || (loading && <Loading />)}

      {status == "authenticated" && !loading && (
        <DashboardLayout>
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 md:p-8">
              <HeaderModule
                addPageURL={USER.PAGE.ADD}
                title={titlePage}
                bcumbs={bcData}
              />

              {loading == false && (
                <div className="rounded-[1rem] bg-[#CAF4AB]">
                  <CustomTable data={tblData} />

                  <PaginationCustom
                    key="userTbl"
                    page={userPgntn.page}
                    nextPage={userPgntn.nextPage}
                    prevPage={userPgntn.prevPage}
                    row={userPgntn.limit}
                    totalPages={userPgntn.totalPages}
                    onNextClick={handleNextClck}
                    onPrevClick={handlePrevClck}
                    onPageNumberClick={(pageNo: number) =>
                      handlePageInputChange(pageNo)
                    }
                    onPageRowChange={(limitNo: number) =>
                      handlePageRowChange(limitNo)
                    }
                    onPageInputChange={(pageNo: number) =>
                      handlePageInputChange(pageNo)
                    }
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
