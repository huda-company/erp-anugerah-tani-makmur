import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bcData } from "^/config/supplier/config";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { useTranslations } from "next-intl";
import { noop } from "^/utils/helpers";
import ItemCategoryForm from "@/components/Item/ItemForm";
import { FormMode } from "^/@types/global";
import { initialItemForm } from "^/config/item/config";

const AddItemCatPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.add")} ${t("Sidebar.itemCategory")}`;

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule title={titlePage} bcumbs={bcData} />
          <div className="rounded-[1rem] border-2 border-primary p-2">
            <ItemCategoryForm
              doRefresh={noop}
              mode={FormMode.ADD}
              initialFormVals={initialItemForm}
            />
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticProps };

export default AddItemCatPage;
