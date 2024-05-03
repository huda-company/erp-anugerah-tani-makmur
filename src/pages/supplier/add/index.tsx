import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bcData, initialSupplierForm } from "^/config/supplier/config";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { useTranslations } from "next-intl";
import SupplierForm from "../../../components/Supplier/SupplierForm";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/models/supplier";

const AddSupplierPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.add")} ${t("Sidebar.supplier")}`;

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule title={titlePage} bcumbs={bcData} />
          <div className="rounded-[1rem] border-2 border-primary p-2">
            <SupplierForm
              doRefresh={noop}
              mode={FormMode.ADD}
              initialFormVals={initialSupplierForm}
            />
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticProps };

export default AddSupplierPage;
