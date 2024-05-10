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
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { bcData } from "^/config/purchase/config";
import useGetPurchase from "@/hooks/purchase/useGetPurchase";
import PaginationCustom from "@/components/PaginationCustom/PaginationCustom";

const PurchasePage = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.purchaseOrder")}`;

  const {
    loading,
    tblBd,
    purchPgntn,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  } = useGetPurchase();

  const header = useMemo(
    () => [
      {
        value: t("PurchasePage.poNo"),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: capitalizeStr(t("Sidebar.supplier")),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: capitalizeStr(t("PurchasePage.expDate")),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: capitalizeStr(t("PurchasePage.year")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("PurchasePage.status")),
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
              addPageURL={PURCHASE_PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {loading && <Loading />}

            {loading == false && (
              <div className="rounded-[1rem] bg-[#CAF4AB]">
                <CustomTable data={tblData} />

                <PaginationCustom
                  key="purchaseTbl"
                  page={purchPgntn.page}
                  nextPage={purchPgntn.nextPage}
                  prevPage={purchPgntn.prevPage}
                  row={purchPgntn.limit}
                  totalPages={purchPgntn.totalPages}
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

export default withAuth(PurchasePage);
