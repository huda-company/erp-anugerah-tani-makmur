import React, { useMemo } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import { withAuth } from "^/utils/withAuth";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { bcData } from "^/config/itemcategory/config";
import CustomTable from "@/components/CustomTable/CustomTable";
import { CustomTblData } from "@/components/CustomTable/types";
import Loading from "@/components/Loading";
import { ITEM_CAT_PAGE } from "@/constants/pageURL";
import useGetItemCat from "@/hooks/itemCategory/useGetItemCat";
import { capitalizeStr } from "^/utils/capitalizeStr";
import PaginationCustom from "@/components/PaginationCustom/PaginationCustom";

const ItemCategory = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.itemCategory")}`;

  const {
    loading,
    tblBd,
    itemCatPgntn,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  } = useGetItemCat();

  const header = useMemo(
    () => [
      {
        value: t("Signup.name"),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: t("Index.description"),
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
              addPageURL={ITEM_CAT_PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {loading && <Loading />}

            {loading == false && (
              <div className="rounded-[1rem] bg-[#CAF4AB]">
                <CustomTable data={tblData} />

                <PaginationCustom
                  key="itemCatTbl"
                  page={itemCatPgntn.page}
                  nextPage={itemCatPgntn.nextPage}
                  prevPage={itemCatPgntn.prevPage}
                  row={itemCatPgntn.limit}
                  totalPages={itemCatPgntn.totalPages}
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

export default withAuth(ItemCategory);
