import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import useAppSelector from "@/hooks/useAppSelector";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

import { selectors as toastSelectors } from "@/redux/toast";

import Header from "./Header";
import Sidebar from "./Sidebar";
import AlertModal from "../AlertModal";

import { APP_NAME } from "^/config/env";
import { getStaticProps } from "^/utils/getStaticProps";
import useCloseAlertModal from "@/hooks/useCloseAlertModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("");
  const router = useRouter();

  const toast = useAppSelector(toastSelectors.toast);
  const { closeAlertModal } = useCloseAlertModal();

  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

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
        onClose={closeAlertModal}
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
