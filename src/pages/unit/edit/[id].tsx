import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { UNIT_PAGE } from "@/constants/pageURL";
import { noop } from "^/utils/helpers";
import { FormMode } from "^/@types/global";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import useGetUnitById from "@/hooks/unit/useGetUnitById";
import UnitForm from "@/components/Unit/UnitForm";
import { bcData } from "^/config/unit/config";

const EditUnitPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.edit")} ${t("Sidebar.unit")}`;

  const { loading, formVal } = useGetUnitById();

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={UNIT_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          <div className="rounded-[1rem] border-2 border-primary p-2">
            {!loading && formVal && formVal.id ? (
              <UnitForm
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

export default EditUnitPage;
