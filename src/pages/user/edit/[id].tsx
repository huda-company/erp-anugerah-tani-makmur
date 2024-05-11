import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bcData } from "^/config/supplier/config";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { USER_PAGE } from "@/constants/pageURL";
import { FormMode } from "^/@types/global";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import useGetUserById from "@/hooks/user/useGetUserById";
import UserForm from "@/components/User/UserForm";
import Loading from "@/components/Loading";

const EditUserPage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.edit")} ${t("Sidebar.user")}`;

  const { loading, formVal, fetch } = useGetUserById();

  const doRefreshData = () => {
    fetch();
  };
  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={USER_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          {loading && <Loading />}

          <div className="rounded-[1rem] border-2 border-primary p-2">
            {!loading && formVal && formVal.id ? (
              <UserForm
                doRefresh={doRefreshData}
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

export default EditUserPage;
