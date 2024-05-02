import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import * as z from "zod";

import useAppDispatch from "@/hooks/useAppDispatch";

import InputPwd from "@/components/InputCustom/InputPwd";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { actions as toastActs } from "@/redux/toast";

import { formSchema, initValSignin } from "^/config/auth/signin/config";
import { capitalizeStr } from "^/utils/capitalizeStr";

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValSignin,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleReset = () => {
    loginForm.setValue("email", "");
    loginForm.setValue("password", "");
  };

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/dashboard",
    })
      .then((res: any) => {
        setLoading(false);
        if (!res.ok && res.status == 401) {
          dispatch(
            toastActs.callShowToast({
              show: true,
              msg: (
                <div className="flex flex-col py-[1rem]">
                  <span>{res.error}</span>
                </div>
              ),
              type: "error",
              // icon: {
              //   src: "/svg/Warning.svg",
              // },
              // timeout: 2000,
            })
          );
        } else if (res.ok) router.push("/dashboard");
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.log("err", err);
      });
  };

  return (
    <>
      <Form {...loginForm}>
        <form
          onReset={() => loginForm.reset}
          onSubmit={loginForm.handleSubmit(onFormSubmit)}
          className="space-y-8"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    {/* <Input type="password" placeholder="Password" {...field} /> */}
                    <InputPwd
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="flex flex-row justify-center gap-3">
            <Button className="bg-primary text-white hover:bg-primary-foreground" type="submit" disabled={loading}>
              {loading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
              {capitalizeStr(t("Signin.signin"))}
            </Button>
            <Button className="bg-gray-700 text-white hover:bg-gray-500" onClick={handleReset} type="reset" disabled={loading}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
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

export default SignInForm;
