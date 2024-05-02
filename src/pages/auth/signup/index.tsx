/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import PageLayout from "@/components/PageLayout";

import SignUpForm from "./SignUpForm";

import { avoidSignIn } from "^/utils/avoidSignIn";

export const getServerSideProps = avoidSignIn;

export default function Index() {
  const t = useTranslations("");

  return (
    <>
      <PageLayout title={t("Signup.register")}>
        <div className="my-[1rem] flex flex-col items-center justify-center">
          <div className="border-4 border-double border-blue-900 p-[2rem] md:w-fit lg:w-[35%]">
            <div className="flex flex-col items-center">
              <img src="/logo.png" height={100} width={100} alt="logo" />
              {/* <Image
                src="/logo.png"
                height={100}
                width={100}
                alt="logo"
              /> */}
            </div>
            <div className="mt-[2rem]">
              <SignUpForm />

              <div className="mt-[1rem] flex flex-row items-center justify-center gap-1 text-xs">
                <p className="flex justify-center">{`${t(
                  "Signup.alreadyHaveAcc"
                )} ? `}</p>
                <Link
                  className="rounded-[0.5rem] bg-blue-100 p-1"
                  href="/auth/signin"
                >
                  {t("Signin.signin")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
