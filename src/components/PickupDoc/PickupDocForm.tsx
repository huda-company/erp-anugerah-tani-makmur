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
import { Controller, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { actions as toastActs } from "@/redux/toast";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { getStaticProps } from "^/utils/getStaticProps";
import { FormMode, Options } from "^/@types/global";
import { initialBranchForm } from "^/config/branch/config";
import {
  IPickupDocForm,
  PickupDocFormProps,
  PickupDocType,
} from "^/@types/models/pickupdoc";
import { PickupDocFormSchema } from "^/config/pickup-doc/config";
import { createPickupDocAPI, editPickupDocAPI } from "^/services/pickup-doc";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { pickupDocTypehOpts } from "^/config/purchase/config";

const PickupDocForm: FC<PickupDocFormProps> = ({
  mode,
  initialFormVals,
  onSubmitOk,
}) => {
  const t = useTranslations("");

  const router = useRouter();

  const { id } = router.query;

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async (values: z.infer<typeof PickupDocFormSchema>) => {
    setLoading(true);
    const prm: IPickupDocForm = {
      type: values.type as PickupDocType,
      code: values.code,
      driverName: values.driverName,
      vehicleType: values.vehicleType,
      flatNo: values.flatNo,
      note: String(values.note),
      description: String(values.description),
      id: initialFormVals.id ?? "",
    };

    const res =
      mode === FormMode.ADD
        ? await createPickupDocAPI(session, prm)
        : await editPickupDocAPI(session, prm);

    if (res && res.status == 200) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>
                {mode === FormMode.ADD
                  ? t("API_MSG.SUCCESS.PICKUP_DOC_CREATE")
                  : t("API_MSG.SUCCESS.PICKUP_DOC_UPDATE")}
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

    setLoading(false);

    onSubmitOk();
  };

  const handleReset = () => {
    picupDocForm.setValue(
      "driverName",
      mode == FormMode.ADD ? "" : initialFormVals.driverName
    );
    picupDocForm.setValue(
      "flatNo",
      mode == FormMode.ADD ? "" : initialFormVals.flatNo
    );
    picupDocForm.setValue(
      "type",
      mode == FormMode.ADD ? "" : initialFormVals.type
    );
    picupDocForm.setValue(
      "vehicleType",
      mode == FormMode.ADD ? "" : initialFormVals.vehicleType
    );
    picupDocForm.setValue(
      "note",
      mode == FormMode.ADD ? "" : initialFormVals.note
    );
    picupDocForm.setValue(
      "description",
      mode == FormMode.ADD ? "" : initialFormVals.description
    );
  };

  const picupDocForm = useForm<z.infer<typeof PickupDocFormSchema>>({
    resolver: zodResolver(PickupDocFormSchema),
    defaultValues: mode == FormMode.ADD ? initialBranchForm : initialFormVals,
  });

  useEffect(() => {
    if (mode !== FormMode.ADD && initialFormVals.id === id) {
      picupDocForm.setValue("type", initialFormVals.code);
      picupDocForm.setValue("type", initialFormVals.type);
      picupDocForm.setValue("description", initialFormVals.description);
      picupDocForm.setValue("note", initialFormVals.note);
      picupDocForm.setValue("driverName", initialFormVals.driverName);
      picupDocForm.setValue("vehicleType", initialFormVals.vehicleType);
      picupDocForm.setValue("flatNo", initialFormVals.flatNo);
    }
  }, [
    picupDocForm,
    id,
    initialFormVals.description,
    initialFormVals.driverName,
    initialFormVals.flatNo,
    initialFormVals.id,
    initialFormVals.note,
    initialFormVals.type,
    initialFormVals.code,
    initialFormVals.vehicleType,
    mode,
  ]);

  return (
    <Form {...picupDocForm}>
      <form
        onReset={() => picupDocForm.reset}
        onSubmit={picupDocForm.handleSubmit(onFormSubmit)}
        className="space-y-3"
      >
        <FormField
          disabled={mode == FormMode.VIEW}
          control={picupDocForm.control}
          name="code"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>{capitalizeStr(t("Common.code"))}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={capitalizeStr(t("Common.code"))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <div className="flex-1">
          <label>{capitalizeStr(t("PurchasePage.docType"))}</label>
          <Controller
            name={`type`}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={capitalizeStr(t("PurchasePage.docType"))}
                  />
                </SelectTrigger>
                <SelectContent>
                  {pickupDocTypehOpts.map((x: Options) => {
                    return (
                      <SelectItem key={x.value} value={x.value}>
                        {x.text}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <FormField
          disabled={mode == FormMode.VIEW}
          control={picupDocForm.control}
          name="vehicleType"
          defaultValue={picupDocForm.getValues("vehicleType")}
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>
                  {capitalizeStr(t("PurchasePage.vehicleType"))}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={capitalizeStr(t("PurchasePage.vehicleType"))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={picupDocForm.control}
          name="flatNo"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>{capitalizeStr(t("PurchasePage.flatNo"))}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={capitalizeStr(t("PurchasePage.flatNo"))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={picupDocForm.control}
          name="driverName"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>
                  {capitalizeStr(t("PurchasePage.driverName"))}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={capitalizeStr(t("PurchasePage.driverName"))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          disabled={mode == FormMode.VIEW}
          control={picupDocForm.control}
          name="description"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>{capitalizeStr(t("Index.description"))}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={capitalizeStr(t("Index.description"))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        <FormField
          disabled={mode == FormMode.VIEW}
          control={picupDocForm.control}
          name="note"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>{capitalizeStr(t("PurchasePage.note"))}</FormLabel>
                <FormControl>
                  {/* <Input placeholder={capitalizeStr(t("PurchasePage.note"))} {...field} /> */}
                  <Textarea
                    {...field}
                    placeholder={capitalizeStr(t("PurchasePage.note"))}
                  />
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

export default PickupDocForm;
