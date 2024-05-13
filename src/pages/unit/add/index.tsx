import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { useTranslations } from "next-intl";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/global";
import UnitForm from "@/components/Unit/UnitForm";
import { bcData, initialUnitForm } from "^/config/unit/config";

const AddUnitPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.add")} ${t("Sidebar.branch")}`;

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule title={titlePage} bcumbs={bcData} />
          <div className="rounded-[1rem] border-2 border-primary p-2">
            <UnitForm
              doRefresh={noop}
              mode={FormMode.ADD}
              initialFormVals={initialUnitForm}
            />
          </div>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticProps };

export default AddUnitPage;
