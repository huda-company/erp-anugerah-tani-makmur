import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";

import { SignUpReq } from "^/@types/models/auth";
import { initSignUpForm } from "^/config/auth/signup/config";
import { formSchema } from "^/config/auth/signup/validations/schema";
import { respBody } from "^/config/serverResponse";
import { signupAPI } from "^/services/auth";
import { getStaticProps } from "^/utils/getStaticProps";

const SignUpForm = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();
  const toast = useAppSelector(toastSelectors.toast);

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [formVal, setFormVal] =
    useState<z.infer<typeof formSchema>>(initSignUpForm);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const validatePhoneNumber = (_: any, value: string) => {
    // Simple phone number validation example
    // You may want to use a more sophisticated validation library or regex
    if (!value || !/^\d{9,}$/.test(value)) {
      return Promise.reject(
        "Please enter a valid phone number. avoid zero on first number"
      );
    }
    return Promise.resolve();
  };

  const signupForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      birthDate: "",
      gender: "",
    },
  });

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setFormVal(values);
    const params: SignUpReq = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      birthDate: values.birthDate,
      gender: values.gender,
    };

    try {
      await signupAPI(params);
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
          // timeout: 2000,
        })
      );
      setTimeout(async () => {
        await goToVerification(params.email);
      }, 2000);
    } catch (error: any) {
      if (error.message) {
        dispatch(
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
          })
        );
      }
    }

    setLoading(false);
  };

  const goToVerification = (email: string) => {
    dispatch(toastActs.callShowToast({ ...toast, show: false }));
    router.push(`${AUTH_PAGE_URL.SIGNUP_VERIF}?e=${encodeURI(email)}`);
  };

  const handleReset = () => {
    signupForm.setValue("email", "");
    signupForm.setValue("password", "");
    signupForm.setValue("birthDate", "");
    signupForm.setValue("gender", "");
    signupForm.setValue("name", "");
    signupForm.setValue("password", "");
    signupForm.setValue("phone", "");
  };

  return (
    <>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onFormSubmit)}
          className="space-y-4"
        >
          <FormField
            control={signupForm.control}
            name="name"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>{t("Signup.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={signupForm.control}
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
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={signupForm.control}
            name="phone"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>{t("Signup.phone")}</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={signupForm.control}
            name="birthDate"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>{t("Signup.birthDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Birth Date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={signupForm.control}
            name="gender"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>{t("Signup.gender")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">male</SelectItem>
                      <SelectItem value="female">female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <div className="flex flex-row justify-center gap-3">
            <Button disabled={loading} className="bg-primary" type="submit">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Signup.register")}
            </Button>
            <Button onClick={handleReset} disabled={loading}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export { getStaticProps };

export default SignUpForm;
