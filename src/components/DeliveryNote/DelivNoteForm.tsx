import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import useAppDispatch from "@/hooks/useAppDispatch";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { actions as toastActs } from "@/redux/toast";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import { FormMode, Options } from "^/@types/global";

import { Textarea } from "../ui/textarea";

import {
  DelivNoteFormProps,
  IDelivNoteForm,
} from "^/@types/models/deliverynote";
import { createDelivNoteAPI, editDelivNoteAPI } from "^/services/delivery-note";
import useGetBranch from "@/hooks/branch/useGetBranch";
import useGetUnit from "@/hooks/unit/useGetUnit";
import useGetItem from "@/hooks/item/useGetItem";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { handleFocusSelectAll, thsandSep } from "^/utils/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const DelivNoteForm: FC<DelivNoteFormProps> = ({
  mode,
  initialFormVals,
  onSubmitOk,
}) => {
  const t = useTranslations("");

  const dispatch = useAppDispatch();

  const { branchOpts } = useGetBranch();
  const { unitDataOpts } = useGetUnit();
  const { itemDataOpts } = useGetItem();

  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async (values: IDelivNoteForm) => {
    setLoading(true);

    const amtTotalCostItems = values.costItems.reduce(
      (acc, item) => acc + +item.amount,
      0
    );
    const amtTotalItems = values.items.reduce(
      (acc, item) => acc + item.total,
      0
    );

    const newPrm: IDelivNoteForm = {
      ...values,
      vehicleType: "TRUCK",
      driverLicenseNo: "DUMMY",
      sellingTotal: amtTotalCostItems + amtTotalItems,
      paymentPurchase: values.id,
    };
    delete newPrm.id;

    const res =
      mode === FormMode.ADD
        ? await createDelivNoteAPI(session, newPrm)
        : await editDelivNoteAPI(session, newPrm);

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
    setValue(
      "driverName",
      mode == FormMode.ADD ? "" : initialFormVals.driverName
    );
    setValue("flatNo", mode == FormMode.ADD ? "" : initialFormVals.flatNo);
    setValue(
      "vehicleType",
      mode == FormMode.ADD ? "" : initialFormVals.vehicleType
    );
    setValue("note", mode == FormMode.ADD ? "" : initialFormVals.note);
    setValue(
      "description",
      mode == FormMode.ADD ? "" : initialFormVals.description
    );
  };

  const calculateSubtotal = (
    quantity: number,
    price: number,
    discount: number
  ) => {
    return quantity * price - (quantity * price * discount) / 100;
  };

  const {
    register,
    setValue,
    getValues,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IDelivNoteForm>({
    mode: "onBlur",
    defaultValues: initialFormVals,
  });

  const { fields } = useFieldArray({
    name: "items",
    control,
  });

  return (
    <form
      onReset={() => reset}
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between py-2">
        <div className="grid w-full items-center gap-y-2 p-2 sm:w-1/2 md:w-1/3 lg:w-1/2 ">
          <div className="flex-1">
            <label>{capitalizeStr(t("Common.code"))}</label>
            <Input
              {...register("code")}
              placeholder={capitalizeStr(t("Common.code"))}
            />
          </div>

          <div className="flex-1">
            <label>{capitalizeStr(t("Common.date"))}</label>
            <Input
              type="date"
              {...register("date")}
              placeholder={capitalizeStr(t("Common.date"))}
            />
          </div>

          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.soNo"))}</label>
            <Input
              {...register("soNumber")}
              placeholder={capitalizeStr(t("PurchasePage.soNo"))}
            />
          </div>
        </div>

        <div className="grid w-full items-center gap-y-2 p-2 sm:w-1/2 md:w-1/3 lg:w-1/2 ">
          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.flatNo"))}</label>
            <Input
              {...register("flatNo")}
              placeholder={capitalizeStr(t("PurchasePage.flatNo"))}
            />
          </div>

          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.driverName"))}</label>
            <Input
              {...register("driverName")}
              placeholder={capitalizeStr(t("PurchasePage.driverName"))}
            />
          </div>

          <div className="flex-1">
            <label>{capitalizeStr(t("Common.destination"))}</label>
            <Controller
              defaultValue={""}
              name={`branch`}
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? branchOpts.find(
                            (language) => language.value === field.value
                          )?.text
                        : `${capitalizeStr(t("Common.select"))} ${capitalizeStr(t("Sidebar.branch"))}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder={`${capitalizeStr(t("Common.search"))} ${capitalizeStr(t("Sidebar.branch"))}`}
                      />
                      <CommandEmpty>No data found.</CommandEmpty>
                      <CommandList>
                        {branchOpts.map((language: Options) => (
                          <CommandItem
                            value={language.text}
                            key={language.value}
                            // onSelect={field.onChange}
                            onSelect={() => {
                              setValue(`branch`, language.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {language.text}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>
      </div>

      {fields.map((field, index) => {
        return (
          <div className="flex flex-row " key={field.id}>
            <section
              className="section mt-[0.3rem] flex w-[100%] flex-row gap-x-4"
              key={field.id}
            >
              <div className="w-[50%] flex-grow">
                {index == 0 && (
                  <label>
                    Item <br />
                  </label>
                )}

                <Controller
                  name={`items.${index}.item`}
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger disabled asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between text-black",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? itemDataOpts.find(
                                (language) => language.value === field.value
                              )?.text
                            : "Select item"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput placeholder="Search item..." />
                          <CommandEmpty>No data found.</CommandEmpty>
                          <CommandList>
                            {itemDataOpts.map((language) => (
                              <CommandItem
                                value={language.text}
                                key={language.value}
                                onSelect={() => {
                                  setValue(
                                    `items.${index}.item`,
                                    language.value
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {language.text}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div className="w-[15%] flex-grow">
                <label>{index == 0 && capitalizeStr(t("Sidebar.unit"))}</label>
                <Controller
                  defaultValue={""}
                  name={`items.${index}.unit`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue
                          placeholder={
                            mode == FormMode.ADD
                              ? `${capitalizeStr(t("Sidebar.unit"))}`
                              : unitDataOpts.find(
                                  (y) =>
                                    y.text == initialFormVals.items[index].unit
                                )?.text
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {unitDataOpts.map((x: Options) => {
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

              <div className="flex-grow">
                <label>
                  {index == 0 && capitalizeStr(t("PurchasePage.quantity"))}
                </label>
                <Input
                  readOnly
                  onFocus={handleFocusSelectAll}
                  placeholder="quantity"
                  type="number"
                  {...register(`items.${index}.quantity` as const, {
                    valueAsNumber: true,
                    required: true,
                    onChange: () => {
                      const newSubTotal = calculateSubtotal(
                        getValues(`items.${index}.quantity`),
                        getValues(`items.${index}.price`),
                        getValues(`items.${index}.discount`)
                      );
                      setValue(`items.${index}.total`, newSubTotal);
                    },
                  })}
                  className={
                    errors?.items?.[index]?.quantity ? "bg-red-100" : ""
                  }
                  defaultValue={field.quantity}
                />
              </div>

              <div className="flex-grow">
                <label>
                  {index == 0 && capitalizeStr(t("DelivNote.sellingPrice"))}
                </label>
                <Input
                  onFocus={handleFocusSelectAll}
                  placeholder="value"
                  type="number"
                  {...register(`items.${index}.price` as const, {
                    valueAsNumber: true,
                    required: true,
                    onChange: () => {
                      const newSubTotal = calculateSubtotal(
                        getValues(`items.${index}.quantity`),
                        getValues(`items.${index}.price`),
                        getValues(`items.${index}.discount`)
                      );
                      setValue(`items.${index}.total`, newSubTotal);
                    },
                  })}
                  className={errors?.items?.[index]?.price ? "bg-red-100" : ""}
                  defaultValue={field.price}
                />
              </div>

              <div className="hidden flex-grow">
                <label>
                  {index == 0 && capitalizeStr(t("PurchasePage.discount"))}
                </label>
                <Input
                  readOnly
                  onFocus={handleFocusSelectAll}
                  placeholder="value"
                  type="number"
                  {...register(`items.${index}.discount` as const, {
                    required: true,
                    onChange: () => {
                      const newSubTotal = calculateSubtotal(
                        getValues(`items.${index}.quantity`),
                        getValues(`items.${index}.price`),
                        getValues(`items.${index}.discount`)
                      );
                      setValue(`items.${index}.total`, newSubTotal);
                    },
                  })}
                  className={
                    errors?.items?.[index]?.discount ? "bg-red-100" : ""
                  }
                  defaultValue={field.discount}
                />
              </div>

              <div className="flex-grow">
                <label>{index == 0 && "Total"}</label>
                <Input
                  readOnly
                  placeholder="value"
                  type="text"
                  {...register(`items.${index}.total` as const, {
                    required: true,
                  })}
                  className={errors?.items?.[index]?.total ? "bg-red-100" : ""}
                  defaultValue={field.total}
                  value={thsandSep(getValues(`items.${index}.total`))}
                />
              </div>

              <div className="flex-grow">
                <label>
                  {index == 0 && capitalizeStr(t("PurchasePage.note"))}
                </label>
                <Input
                  onFocus={handleFocusSelectAll}
                  {...register(`items.${index}.note` as const)}
                  className={errors?.items?.[index]?.note ? "bg-red-100" : ""}
                  defaultValue={field.note}
                />
              </div>
            </section>
          </div>
        );
      })}

      <div className="flex flex-col gap-x-6">
        <label>{capitalizeStr(t("Index.description"))}</label>
        <Textarea
          {...register("description")}
          placeholder={capitalizeStr(t("Index.description"))}
        />
      </div>

      <div className="flex flex-col gap-x-6">
        <label>{capitalizeStr(t("PurchasePage.note"))}</label>
        <Textarea
          {...register("note")}
          placeholder={capitalizeStr(t("PurchasePage.note"))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {initialFormVals.costItems.map((item, index) => (
          <div className="flex-1" key={index}>
            <label>Biaya {capitalizeStr(t(`DelivNote.${item.type}`))}</label>
            <Input
              min={0}
              type="number"
              onFocus={handleFocusSelectAll}
              {...register(`costItems.${index}.amount` as const)}
              placeholder={capitalizeStr(t(`DelivNote.${item.type}`))}
            />
          </div>
        ))}
      </div>

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
  );
};

export { getStaticProps };

export default DelivNoteForm;
