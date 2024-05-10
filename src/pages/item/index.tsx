import React, { useMemo } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import { capitalizeStr } from "^/utils/capitalizeStr";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData } from "^/config/supplier/config";
import CustomTable from "@/components/CustomTable/CustomTable";
import { CustomTblData } from "@/components/CustomTable/types";
import Loading from "@/components/Loading";
import { ITEM_PAGE } from "@/constants/pageURL";
import useGetItem from "@/hooks/item/useGetItem";
import PaginationCustom from "@/components/PaginationCustom/PaginationCustom";

const Item = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.item")}`;

  const {
    loading,
    tblBd,
    itemPgntn,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  } = useGetItem();
  console.log("tblBd", tblBd);

  const header = useMemo(
    () => [
      {
        value: capitalizeStr(t("Sidebar.itemCategory")),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: capitalizeStr(t("Signup.name")),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: capitalizeStr(t("Index.description")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("Index.price")),
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
              addPageURL={ITEM_PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {loading && <Loading />}

            {loading == false && (
              <div className="rounded-[1rem] bg-[#CAF4AB]">
                <CustomTable data={tblData} />

                <PaginationCustom
                  key="itemTbl"
                  page={itemPgntn.page}
                  nextPage={itemPgntn.nextPage}
                  prevPage={itemPgntn.prevPage}
                  row={itemPgntn.limit}
                  totalPages={itemPgntn.totalPages}
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

export default withAuth(Item);
