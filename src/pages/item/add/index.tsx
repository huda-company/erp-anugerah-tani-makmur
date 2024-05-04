import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { useTranslations } from "next-intl";
import { noop } from "^/utils/helpers";
import { bcData, initialItemForm } from "^/config/item/config";
import { FormMode } from "^/@types/global";
import ItemForm from "@/components/Item/ItemForm";

const AddSupplierPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.add")} ${t("Sidebar.item")}`;

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule title={titlePage} bcumbs={bcData} />
          <div className="rounded-[1rem] border-2 border-primary p-2">
            <ItemForm
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

export default AddSupplierPage;
