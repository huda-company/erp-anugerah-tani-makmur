import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bcData } from "^/config/supplier/config";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { SUPPLIER_PAGE } from "@/constants/pageURL";
import SupplierForm from "../../../components/Supplier/SupplierForm";
import useGetSupplierById from "@/hooks/supplier/useGetSupplierById";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/models/supplier";

const EditSupplierPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.edit")} ${t("Sidebar.supplier")}`;

  const { formVal } = useGetSupplierById();

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
            <SupplierForm
              doRefresh={noop}
              initialFormVals={formVal}
              mode={FormMode.EDIT}
            />
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticPaths, getStaticProps };

export default EditSupplierPage;
