import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { bcData } from "^/config/purchase/config";
import Loading from "@/components/Loading";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import PurchDetailSect from "@/components/Purchase/PurchDetailSect";
import PurchPaymSect from "@/components/Purchase/PurchPaymSect";
import PurchFileSect from "@/components/Purchase/PurchFileSect";

const ViewPurchasePage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.detail")} ${t("Sidebar.purchaseOrder")}`;

  const { purchase, loading } = useGetPurchaseById();

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

          {!loading && purchase ? (
            <div className="flex flex-col gap-y-2 rounded-[1rem] border-2 border-primary p-4">
              <PurchDetailSect />

              <div className="mt-[0.5rem] flex gap-x-4">
                <PurchPaymSect />

                <PurchFileSect />
              </div>
            </div>
          ) : (
            <EmptyContent />
          )}
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticPaths, getStaticProps };

export default ViewPurchasePage;
