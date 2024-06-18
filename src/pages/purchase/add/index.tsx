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
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

const AddBranchPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.create")} ${t("Sidebar.purchaseOrder")}`;

  const { status } = useSession();

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule title={titlePage} bcumbs={bcData} />
          <div className="rounded-[1rem] border-2 border-primary p-2">
            {status == "loading" && <Loading />}
            {status == "authenticated" && (
              <PurchaseForm
                doRefresh={noop}
                mode={FormMode.ADD}
                initialFormVals={initialPurchaseForm}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticProps };

export default AddBranchPage;
