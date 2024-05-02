/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useState } from "react";

import useAppDispatch from "@/hooks/useAppDispatch";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { actions as toastActs } from "@/redux/toast";

import { respBody } from "^/config/serverResponse";
import { signupVerifAPI } from "^/services/auth";

const SignupVerif = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { e } = router.query;
  const [email, setEmail] = useState<string>(String(e));
  const [code, setCode] = useState<string>("");

  const handleVerifCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmitVerifCode = async () => {
    try {
      await signupVerifAPI({
        type: "email",
        code: code,
        email: email,
      });
      await dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem] capitalize">
              <span>{respBody.SUCCESS.NEW_USER_CREATE.message}</span>
              <span>
                Please check your email and get the verification code.
              </span>
              <span>You will be redirected to verification page.</span>
            </div>
          ),
          type: "success",
          // icon: {
          //   src: "/svg/Warning.svg",
          // },
          timeout: 3000,
        })
      );

      goToDashboard();
    } catch (error: any) {
      if (error.message) {
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>{error.message}</span>
            </div>
          ),
          type: "error",
          // icon: {
          //   src: "/svg/Warning.svg",
          // },
          // timeout: 2000,
        });
      }
    }
  };

  const goToDashboard = async () => {
    setTimeout(() => {
      router.push(AUTH_PAGE_URL.SIGNIN);
    }, 1000);
  };

  return (
    <>
      <PageLayout title={t("Index.emailVerification")}>
        <div className="my-[1rem] flex flex-col items-center justify-center ">
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
            <div className="align-center mt-[2rem] flex flex-col justify-center gap-y-[1rem]">
              <p className="text-center text-2xl">
                <u>{t("Index.emailVerification")}</u>
              </p>
              <Input
                value={e}
                readOnly
                onChange={handleEmailChange}
                name="email"
                placeholder="email"
              />
              <Input
                onChange={handleVerifCodeChange}
                name="verifCode"
                placeholder="verification code"
              />
              <Button onClick={handleSubmitVerifCode}>Submit</Button>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export async function getStaticProps(context: any) {
  return {
    props: {
      messages: (await import(`^/dictionaries/${context.locale}.json`)).default,
    },
  };
}

export default SignupVerif;
