import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { SUPPLIER_PAGE } from "@/constants/pageURL";
import { FormMode } from "^/@types/global";
import useGetItemCatById from "@/hooks/itemCategory/useGetItemCatById";
import { bcData } from "^/config/itemcategory/config";
import ItemCategoryForm from "@/components/ItemCategory/ItemCategoryForm";

const ViewItemCatPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.detail")} ${t("Sidebar.itemCategory")}`;

  const { formVal, fetch } = useGetItemCatById();

  const doRefreshData = () => {
    fetch();
  };

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={SUPPLIER_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          <div className="rounded-[1rem] border-2 border-primary p-2">
            <ItemCategoryForm
              doRefresh={doRefreshData}
              initialFormVals={formVal}
              mode={FormMode.VIEW}
            />
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticPaths, getStaticProps };

export default ViewItemCatPage;
