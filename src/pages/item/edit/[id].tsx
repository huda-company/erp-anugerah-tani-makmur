import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { ITEM_PAGE } from "@/constants/pageURL";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/global";
import ItemForm from "@/components/Item/ItemForm";
import useGetItemById from "@/hooks/item/useGetItemById";
import { bcData } from "^/config/item/config";
import EmptyContent from "@/components/EmptyContent/EmptyContent";

const EditItemPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.edit")} ${t("Sidebar.item")}`;

  const { loading, formVal } = useGetItemById();

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

export default EditItemPage;
