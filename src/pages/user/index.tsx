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
import { BRANCH_PAGE } from "@/constants/pageURL";
import { capitalizeStr } from "^/utils/capitalizeStr";
import PaginationCustom from "@/components/PaginationCustom/PaginationCustom";
import useGetUser from "@/hooks/user/useGetUser";
import { bcData } from "^/config/user/config";

const UserPage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.user")}`;

  const {
    loading,
    tblBd,
    branchPgntn,
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
      <DashboardLayout>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 md:p-8">
            <HeaderModule
              addPageURL={BRANCH_PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {loading && <Loading />}

            {loading == false && (
              <div className="rounded-[1rem] bg-[#CAF4AB]">
                <CustomTable data={tblData} />

                <PaginationCustom
                  key="branchTbl"
                  page={branchPgntn.page}
                  nextPage={branchPgntn.nextPage}
                  prevPage={branchPgntn.prevPage}
                  row={branchPgntn.limit}
                  totalPages={branchPgntn.totalPages}
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
    </>
  );
};

export { getStaticProps };

export default withAuth(UserPage);
