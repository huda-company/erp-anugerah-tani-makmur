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
import { FormMode } from "^/@types/global";
import { BranchFormProps, IBranchForm } from "^/@types/models/branch";
import { addBranchAPI, editBranchAPI } from "^/services/branch";
import { BranchFormSchema, initialBranchForm } from "^/config/branch/config";

const BranchForm: FC<BranchFormProps> = ({
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

  const onFormSubmit = async (values: z.infer<typeof BranchFormSchema>) => {
    setLoading(true);
    const prm: IBranchForm = {
      name: values.name,
      city: values.city,
      address: values.address,
      description: values.description,
      id: initialFormVals.id ?? "",
    };
    const res =
      mode === FormMode.ADD
        ? await addBranchAPI(session, prm)
        : await editBranchAPI(session, prm);
    if (res && res.status == 200) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>
                {mode === FormMode.ADD
                  ? t("API_MSG.SUCCESS.NEW_BRANCH_CREATE")
                  : t("API_MSG.SUCCESS.BRANCH_UPDATE")}
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
    branchForm.setValue(
      "city",
      mode == FormMode.ADD ? "" : initialFormVals.city
    );
    branchForm.setValue(
      "address",
      mode == FormMode.ADD ? "" : initialFormVals.address
    );
    branchForm.setValue(
      "description",
      mode == FormMode.ADD ? "" : initialFormVals.description
    );
    branchForm.setValue(
      "name",
      mode == FormMode.ADD ? "" : initialFormVals.name
    );
  };

  const branchForm = useForm<z.infer<typeof BranchFormSchema>>({
    resolver: zodResolver(BranchFormSchema),
    defaultValues: mode == FormMode.ADD ? initialBranchForm : initialFormVals,
  });

  useEffect(() => {
    if (mode !== FormMode.ADD && initialFormVals.id === id) {
      branchForm.setValue("description", initialFormVals.description);
      branchForm.setValue("name", initialFormVals.name);
      branchForm.setValue("city", initialFormVals.city);
      branchForm.setValue("address", initialFormVals.address);
    }
  }, [
    branchForm,
    id,
    initialFormVals.address,
    initialFormVals.city,
    initialFormVals.description,
    initialFormVals.id,
    initialFormVals.name,
    mode,
  ]);

  return (
    <Form {...branchForm}>
      <form
        onReset={() => branchForm.reset}
        onSubmit={branchForm.handleSubmit(onFormSubmit)}
        className="space-y-8"
      >
        <FormField
          disabled={mode == FormMode.VIEW}
          control={branchForm.control}
          name="name"
          defaultValue={branchForm.getValues("name")}
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
          control={branchForm.control}
          name="city"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={branchForm.control}
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
          control={branchForm.control}
          name="description"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
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

export default BranchForm;
