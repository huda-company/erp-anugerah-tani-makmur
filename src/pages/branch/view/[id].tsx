import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { BRANCH_PAGE } from "@/constants/pageURL";
import { FormMode } from "^/@types/global";
import { bcData } from "^/config/itemcategory/config";
import BranchForm from "@/components/Branch/BranchForm";
import useGetBranchById from "@/hooks/branch/useGetBranchById";
import EmptyContent from "@/components/EmptyContent/EmptyContent";

const ViewBranchPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.detail")} ${t("Sidebar.branch")}`;

  const { loading, formVal, fetch } = useGetBranchById();

  const doRefreshData = () => {
    fetch();
  };

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={BRANCH_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          <div className="rounded-[1rem] border-2 border-primary p-2">
            {!loading && typeof formVal !== "undefined" && formVal.id ? (
              <BranchForm
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
