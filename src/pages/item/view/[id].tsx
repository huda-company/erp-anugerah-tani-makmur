import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { ITEM_PAGE } from "@/constants/pageURL";
import { FormMode } from "^/@types/global";
import ItemForm from "@/components/Item/ItemForm";
import useGetItemById from "@/hooks/item/useGetItemById";
import { bcData } from "^/config/item/config";
import EmptyContent from "@/components/EmptyContent/EmptyContent";

const ViewSupplierPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.detail")} ${t("Sidebar.item")}`;

  const { loading, formVal, fetch } = useGetItemById();

  const doRefreshData = () => {
    fetch();
  };

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={ITEM_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          <div className="rounded-[1rem] border-2 border-primary p-2">
            {!loading && formVal && formVal.id ? (
              <ItemForm
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

export default ViewSupplierPage;
