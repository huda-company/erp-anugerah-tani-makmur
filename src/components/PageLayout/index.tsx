import Head from "next/head";
import { useTranslations } from "next-intl";

import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";

import { PageLayoutProps } from "./types";
import AlertModal from "../AlertModal";
import Footer from "../Footer/Footer";
import Topbar from "../Topbar/Topbar";

import { APP_NAME } from "^/config/env";
import { getStaticProps } from "^/utils/getStaticProps";

export default function PageLayout({ children }: PageLayoutProps) {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

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
        title={t(`Common.${toast.type}`)}
        content={toast.msg}
        onClose={() => closeAlertModal()}
        // icon={toast.icon}
      />
      <div
        className="px-[0.5rem]"
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.5,
        }}
      >
        <div className="flex min-h-screen flex-col">
          <Topbar />

          {children}

          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
export { getStaticProps };
