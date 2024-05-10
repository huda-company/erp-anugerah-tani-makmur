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
import useGetSupplier from "@/hooks/supplier/useGetSupplier";
import Loading from "@/components/Loading";
import { SUPPLIER_PAGE } from "@/constants/pageURL";
import PaginationCustom from "@/components/PaginationCustom/PaginationCustom";

const Supplier = () => {
  const t = useTranslations("");
  const titlePage = `${t("Sidebar.supplier")}`;

  const {
    loading,
    tblBd,
    suppPgntn,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  } = useGetSupplier();

  const header = useMemo(
    () => [
      {
        value: t("Common.code"),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: t("Signup.name"),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: t("Signup.phone"),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr("email"),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: t("ParkingField.address"),
        className: "text-left text-xs w-[6rem] p-0",
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
              addPageURL={SUPPLIER_PAGE.ADD}
              title={titlePage}
              bcumbs={bcData}
            />

            {loading && <Loading />}

            {loading == false && (
              <div className="rounded-[1rem] bg-[#CAF4AB]">
                <CustomTable data={tblData} />

                <PaginationCustom
                  key="suppTbl"
                  page={suppPgntn.page}
                  nextPage={suppPgntn.nextPage}
                  prevPage={suppPgntn.prevPage}
                  row={suppPgntn.limit}
                  totalPages={suppPgntn.totalPages}
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

export default withAuth(Supplier);
