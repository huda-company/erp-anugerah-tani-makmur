import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/global";
import PurchaseForm from "@/components/Purchase/PurchaseForm";
import { bcData } from "^/config/purchase/config";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import Loading from "@/components/Loading";

const EditBranchPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.edit")} ${t("Sidebar.purchaseOrder")}`;

  const { loading, formVal } = useGetPurchaseById();

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={PURCHASE_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          {loading && <Loading />}

          <div className="rounded-[1rem] border-2 border-primary p-2">
            {!loading && formVal && formVal.poNo ? (
              <PurchaseForm
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
