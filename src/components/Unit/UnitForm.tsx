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
import { IUnitForm, UnitFormProps } from "^/@types/models/unit";
import { UnitFormSchema, initialUnitForm } from "^/config/unit/config";
import { addUnitAPI, editUnitAPI } from "^/services/unit";

const UnitForm: FC<UnitFormProps> = ({ mode, initialFormVals, doRefresh }) => {
  const t = useTranslations("");

  const router = useRouter();

  const { id } = router.query;

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async (values: z.infer<typeof UnitFormSchema>) => {
    setLoading(true);
    const prm: IUnitForm = {
      name: values.name,
      description: values.description,
      id: initialFormVals.id ?? "",
    };
    const res =
      mode === FormMode.ADD
        ? await addUnitAPI(session, prm)
        : await editUnitAPI(session, prm);
    if (res && res.status == 200) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>
                {mode === FormMode.ADD
                  ? t("API_MSG.SUCCESS.NEW_UNIT_CREATE")
                  : t("API_MSG.SUCCESS.UNIT_UPDATE")}
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
    unitForm.setValue(
      "description",
      mode == FormMode.ADD ? "" : initialFormVals.description
    );
    unitForm.setValue("name", mode == FormMode.ADD ? "" : initialFormVals.name);
  };

  const unitForm = useForm<z.infer<typeof UnitFormSchema>>({
    resolver: zodResolver(UnitFormSchema),
    defaultValues: mode == FormMode.ADD ? initialUnitForm : initialFormVals,
  });

  useEffect(() => {
    if (mode !== FormMode.ADD && initialFormVals.id === id) {
      unitForm.setValue("description", initialFormVals.description);
      unitForm.setValue("name", initialFormVals.name);
    }
  }, [
    id,
    initialFormVals.description,
    initialFormVals.id,
    initialFormVals.name,
    mode,
    unitForm,
  ]);

  return (
    <Form {...unitForm}>
      <form
        onReset={() => unitForm.reset}
        onSubmit={unitForm.handleSubmit(onFormSubmit)}
        className="space-y-8"
      >
        <FormField
          disabled={mode == FormMode.VIEW}
          control={unitForm.control}
          name="name"
          defaultValue={unitForm.getValues("name")}
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
          control={unitForm.control}
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

export default UnitForm;
