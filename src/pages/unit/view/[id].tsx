import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { UNIT_PAGE } from "@/constants/pageURL";
import { FormMode } from "^/@types/global";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import UnitForm from "@/components/Unit/UnitForm";
import useGetUnitById from "@/hooks/unit/useGetUnitById";
import { bcData } from "^/config/unit/config";

const ViewBranchPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.detail")} ${t("Sidebar.unit")}`;

  const { loading, formVal, fetch } = useGetUnitById();

  const doRefreshData = () => {
    fetch();
  };

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={UNIT_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          <div className="rounded-[1rem] border-2 border-primary p-2">
            {!loading && typeof formVal !== "undefined" && formVal.id ? (
              <UnitForm
                doRefresh={doRefreshData}
                initialFormVals={formVal}
                mode={FormMode.VIEW}
              />
            ) : (
              <EmptyContent />
            )}
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticPaths, getStaticProps };

export default ViewBranchPage;
