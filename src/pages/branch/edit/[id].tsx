import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bcData } from "^/config/supplier/config";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { BRANCH_PAGE } from "@/constants/pageURL";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/global";
import BranchForm from "@/components/Branch/BranchForm";
import useGetBranchById from "@/hooks/branch/useGetBranchById";
import EmptyContent from "@/components/EmptyContent/EmptyContent";

const EditBranchPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.edit")} ${t("Sidebar.branch")}`;

  const { loading, formVal } = useGetBranchById();

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
            {!loading && formVal && formVal.id ? (
              <BranchForm
                doRefresh={noop}
                initialFormVals={formVal}
                mode={FormMode.EDIT}
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

export default EditBranchPage;
