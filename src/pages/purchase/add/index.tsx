import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { useTranslations } from "next-intl";
import PurchaseForm from "@/components/Purchase/PurchaseForm";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/global";
import { bcData, initialPurchaseForm } from "^/config/purchase/config";

const AddBranchPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.create")} ${t("Sidebar.purchaseOrder")}`;

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule title={titlePage} bcumbs={bcData} />
          <div className="rounded-[1rem] border-2 border-primary p-2">
            <PurchaseForm
              doRefresh={noop}
              mode={FormMode.ADD}
              initialFormVals={initialPurchaseForm}
            />
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticProps };

export default AddBranchPage;
