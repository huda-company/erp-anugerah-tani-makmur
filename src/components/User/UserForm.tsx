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
import useAppDispatch from "@/hooks/useAppDispatch";
import { zodResolver } from "@hookform/resolvers/zod";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { actions as toastActs } from "@/redux/toast";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { getStaticProps } from "^/utils/getStaticProps";
import { FormMode, Options } from "^/@types/global";
import { IUserForm, UserFormProps } from "^/@types/models/user";
import { UserFormSchema, initialUserForm } from "^/config/user/config";
import { addUserAPI, editUserAPI } from "^/services/user";
import { formatDate } from "^/utils/dateFormatting";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useGetRole from "@/hooks/role/useGetRole";

const UserForm: FC<UserFormProps> = ({ mode, initialFormVals, doRefresh }) => {
  const t = useTranslations("");

  const router = useRouter();

  const { id } = router.query;

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const { roleOpts } = useGetRole();

  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async (values: z.infer<typeof UserFormSchema>) => {
    setLoading(true);
    const prm: IUserForm = {
      name: values.name,
      email: values.email,
      password: values.password ?? initialFormVals.password,
      phone: values.phone,
      role: values.role,
      birthDate: values.birthDate,
      enabled: values.enabled,
      id: initialFormVals.id ?? "",
    };
    const res =
      mode === FormMode.ADD
        ? await addUserAPI(session, prm)
        : await editUserAPI(session, prm);
    if (res && res.status == 200) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>
                {mode === FormMode.ADD
                  ? t("API_MSG.SUCCESS.NEW_USER_CREATE")
                  : t("API_MSG.SUCCESS.USER_UPDATE")}
              </span>
            </div>
          ),
          type: "success",
        })
      );
    } else {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>{t("API_MSG.ERROR.UNEXPECTED_ERROR")}</span>
            </div>
          ),
          type: "error",
        })
      );
    }

    if (mode == FormMode.ADD) handleReset();
    else doRefresh;

    setLoading(false);
  };

  const handleReset = () => {
    router.reload();
    // userForm.setValue(
    //   "email",
    //   mode == FormMode.ADD ? "" : initialFormVals.email
    // );
    // userForm.setValue(
    //   "enabled",
    //   mode == FormMode.ADD ? "" : initialFormVals.enabled ? "active" : "inactive"
    // );
    // userForm.setValue(
    //   "phone",
    //   mode == FormMode.ADD ? "" : initialFormVals.phone
    // );
    // userForm.setValue(
    //   "name",
    //   mode == FormMode.ADD ? "" : initialFormVals.name
    // );
    // userForm.setValue(
    //   "role",
    //   mode == FormMode.ADD ? "" : initialFormVals.role
    // );
    // userForm.setValue(
    //   "birthDate",
    //   mode == FormMode.ADD ? "" : formatDate(initialFormVals.birthDate, "YYYY-MM-DD")
    // );
  };

  const userForm = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: mode == FormMode.ADD ? initialUserForm : initialFormVals,
  });

  useEffect(() => {
    if (mode !== FormMode.ADD && initialFormVals.id === id) {
      userForm.setValue("email", initialFormVals.email);
      userForm.setValue("name", initialFormVals.name);
      userForm.setValue("role", initialFormVals.role);
      userForm.setValue(
        "enabled",
        initialFormVals.enabled ? "active" : "inactive"
      );
      userForm.setValue(
        "birthDate",
        formatDate(initialFormVals.birthDate, "YYYY-MM-DD")
      );
    }
  }, [
    id,
    initialFormVals.birthDate,
    initialFormVals.email,
    initialFormVals.enabled,
    initialFormVals.id,
    initialFormVals.name,
    initialFormVals.role,
    mode,
    userForm,
  ]);

  return (
    <Form {...userForm}>
      <form
        onReset={() => userForm.reset}
        onSubmit={userForm.handleSubmit(onFormSubmit)}
        className="space-y-8"
      >
        <FormField
          disabled={mode == FormMode.VIEW}
          control={userForm.control}
          name="role"
          defaultValue={initialFormVals.role}
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  disabled={mode == FormMode.VIEW}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          mode == FormMode.ADD
                            ? "Select Role"
                            : roleOpts.find(
                                (y) => y.value == initialFormVals.role
                              )?.text
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleOpts.map((x: Options) => {
                      return (
                        <SelectItem key={x.value} value={x.value}>
                          {x.text}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          disabled={mode == FormMode.VIEW}
          control={userForm.control}
          name="name"
          defaultValue={userForm.getValues("name")}
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={userForm.control}
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
          disabled={mode == FormMode.VIEW}
          control={userForm.control}
          name="phone"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          disabled={mode == FormMode.VIEW}
          control={userForm.control}
          name="birthDate"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <Input type="Date" placeholder="Birth Date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        {mode !== FormMode.VIEW && (
          <div className="flex flex-row justify-center gap-3">
            <Button
              className="bg-primary text-white hover:bg-primary-foreground"
              type="submit"
              disabled={loading}
            >
              {loading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
              {capitalizeStr("Submit")}
            </Button>
            <Button
              className="bg-gray-700 text-white hover:bg-gray-500"
              onClick={handleReset}
              type="reset"
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export { getStaticProps };

export default UserForm;
