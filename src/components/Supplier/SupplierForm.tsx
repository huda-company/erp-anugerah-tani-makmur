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
import {
  FormMode,
  ISupplierForm,
  SupplierFormProps,
} from "^/@types/models/supplier";
import {
  SupplierFormSchema,
  initialSupplierForm,
} from "^/config/supplier/config";
import { addSupplierAPI, editSupplierAPI } from "^/services/supplier";
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

const SupplierForm: FC<SupplierFormProps> = ({
  mode,
  initialFormVals,
  doRefresh,
}) => {
  const t = useTranslations("");

  const router = useRouter();

  const { id } = router.query;

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async (values: z.infer<typeof SupplierFormSchema>) => {
    setLoading(true);
    const prm: ISupplierForm = {
      email: values.email,
      managerName: values.managerName,
      managerSurname: values.managerSurname,
      bankAccount: values.bankAccount,
      tel: values.tel,
      address: values.address,
      company: values.name,
      id: initialFormVals.id ?? "",
    };
    const res =
      mode === FormMode.ADD
        ? await addSupplierAPI(session, prm)
        : await editSupplierAPI(session, prm);
    if (res && res.status == 200) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>
                {mode === FormMode.ADD
                  ? t("API_MSG.SUCCESS.NEW_SUPPLIER_CREATE")
                  : t("API_MSG.SUCCESS.SUPPLIER_UPDATE")}
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
    doRefresh;
    setLoading(false);
  };

  const handleReset = () => {
    supplierForm.setValue("email", "");
    supplierForm.setValue("name", "");
    supplierForm.setValue("managerName", "");
    supplierForm.setValue("managerSurname", "");
    supplierForm.setValue("address", "");
    supplierForm.setValue("bankAccount", "");
    supplierForm.setValue("tel", "");
  };

  const supplierForm = useForm<z.infer<typeof SupplierFormSchema>>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: mode == FormMode.ADD ? initialSupplierForm : initialFormVals,
  });

  useEffect(() => {
    if (mode !== FormMode.ADD && initialFormVals.id === id) {
      supplierForm.setValue("address", initialFormVals.address);
      supplierForm.setValue("name", initialFormVals.company);
      supplierForm.setValue("managerName", initialFormVals.managerName);
      supplierForm.setValue("managerSurname", initialFormVals.managerSurname);
      supplierForm.setValue("bankAccount", initialFormVals.bankAccount);
      supplierForm.setValue("tel", initialFormVals.tel);
      supplierForm.setValue("email", initialFormVals.email);
    }
  }, [
    id,
    initialFormVals.address,
    initialFormVals.bankAccount,
    initialFormVals.company,
    initialFormVals.email,
    initialFormVals.id,
    initialFormVals.managerName,
    initialFormVals.managerSurname,
    initialFormVals.tel,
    mode,
    supplierForm,
  ]);

  return (
    <Form {...supplierForm}>
      <form
        onReset={() => supplierForm.reset}
        onSubmit={supplierForm.handleSubmit(onFormSubmit)}
        className="space-y-8"
      >
        <FormField
          disabled={mode == FormMode.VIEW}
          control={supplierForm.control}
          name="email"
          defaultValue={supplierForm.getValues("email")}
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
          control={supplierForm.control}
          name="name"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={supplierForm.control}
          name="managerName"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Manager Name</FormLabel>
                <FormControl>
                  <Input placeholder="Manager Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={supplierForm.control}
          name="managerSurname"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Manager Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Manager Surname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={supplierForm.control}
          name="address"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={supplierForm.control}
          name="bankAccount"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Bank Account</FormLabel>
                <FormControl>
                  <Input placeholder="Bank Account" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={supplierForm.control}
          name="tel"
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

export default SupplierForm;
