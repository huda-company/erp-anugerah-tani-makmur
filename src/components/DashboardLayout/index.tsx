import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";

import Header from "./Header";
import Sidebar from "./Sidebar";
import AlertModal from "../AlertModal";

import { APP_NAME } from "^/config/env";
import { getStaticProps } from "^/utils/getStaticProps";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("");
  const router = useRouter();

  const dispatch = useAppDispatch();
  const toast = useAppSelector(toastSelectors.toast);

  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

  const closeAlertModal = async () => {
    await dispatch(
      toastActs.callShowToast({
        ...toast,
        show: false,
      })
    );
  };

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <AlertModal
        open={toast.show}
        title={
          toast.type && !["form"].includes(toast.type)
            ? t(`Common.${toast.type}`)
            : ""
        }
        content={toast.msg}
        onClose={() => closeAlertModal()}
        className={toast && toast.type == "form" && " min-w-[60%]"}
        // icon={toast.icon}
      />
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-10">{children}</main>
      </div>
    </>
  );
}

export { getStaticProps };
