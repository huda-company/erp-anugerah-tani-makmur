import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { BRANCH_PAGE } from "@/constants/pageURL";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/global";
import PurchaseForm from "@/components/Purchase/PurchaseForm";
import { bcData } from "^/config/purchase/config";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";

const EditBranchPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.edit")} ${t("Sidebar.purchaseOrder")}`;

  const { loading, formVal } = useGetPurchaseById();

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={BRANCH_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          {!loading && (
            <div className="rounded-[1rem] border-2 border-primary p-2">
              <PurchaseForm
                doRefresh={noop}
                initialFormVals={formVal}
                mode={FormMode.EDIT}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticPaths, getStaticProps };

export default EditBranchPage;
