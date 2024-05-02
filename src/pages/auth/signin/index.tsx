/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import PageLayout from "@/components/PageLayout";

import SignInForm from "./SigninForm";

import { avoidSignIn } from "^/utils/avoidSignIn";

export const getServerSideProps = avoidSignIn;

const Signin = () => {
  const t = useTranslations();

  return (
    <PageLayout title={t("Signin.signin")}>
      <div className="my-[1rem] flex flex-col items-center justify-center ">
        <div className="rounded-[1rem] border-4 border-double border-blue-900 p-[2rem]">
          <Link href="/">
            <div className="flex flex-col items-center">
              <img src="/logo.png" height={100} width={100} alt="logo" />
            </div>
          </Link>
          <div className="mt-[2rem]">
            <SignInForm />

            {/* <div className="mt-[1rem] flex flex-row items-center justify-center gap-1 text-xs">
              <p className="flex justify-center">{`${capitalizeStr(
                t("Signin.dontHaveAcc")
              )}`}</p>
              <Link
                className="rounded-[0.5rem] bg-blue-100 p-1"
                href="/auth/signup"
              >
                {t("Signin.createNow")}
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Signin;
