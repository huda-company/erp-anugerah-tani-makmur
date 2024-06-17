import useAppDispatch from "@/hooks/useAppDispatch";

import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { getStaticProps } from "^/utils/getStaticProps";
import { Input } from "../ui/input";
import useGetItem from "@/hooks/item/useGetItem";
import { AiFillPlusCircle } from "react-icons/ai";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { handleFocusSelectAll, thsandSep } from "^/utils/helpers";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { FaSpinner } from "react-icons/fa";
import clsxm from "^/utils/clsxm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormMode, Options } from "^/@types/global";
import { IPurchaseForm, PurchaseFormProps } from "^/@types/models/purchase";
import useGetSupplier from "@/hooks/supplier/useGetSupplier";
import { initialPurchaseForm, paymentMethOpts } from "^/config/purchase/config";
import { createPurchaseAPI, editPurchaseAPI } from "^/services/purchase";
import { actions as toastActs } from "@/redux/toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import useMount from "@/hooks/useMount";
import useGetUnit from "@/hooks/unit/useGetUnit";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PurchaseForm: FC<PurchaseFormProps> = ({ mode, initialFormVals }) => {
  const t = useTranslations("");

  const router = useRouter();
  const { id } = router.query;

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(
    mode == FormMode.ADD ? true : false
  );

  const { unitDataOpts, fetch: fetchUnit } = useGetUnit();
  const { reqPrm, itemDataOpts, fetch: fetchItem } = useGetItem();
  console.log(" itemDataOpts", itemDataOpts);
  const { supplierOpts, fetch: fetchSupp } = useGetSupplier();

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
    handleSubmit,
    formState: { errors },
  } = useForm<IPurchaseForm>({
    defaultValues: {
      year:
        mode == FormMode.ADD ? initialPurchaseForm.year : initialFormVals.year,
      date:
        mode == FormMode.ADD ? initialPurchaseForm.date : initialFormVals.date,
      expDate:
        mode == FormMode.ADD
          ? initialPurchaseForm.expDate
          : initialFormVals.expDate,
      soNumber:
        mode == FormMode.ADD
          ? initialPurchaseForm.soNumber
          : initialFormVals.soNumber,
      note:
        mode == FormMode.ADD ? initialPurchaseForm.note : initialFormVals.note,
      poNo:
        mode == FormMode.ADD ? initialPurchaseForm.poNo : initialFormVals.poNo,
      billingCode:
        mode == FormMode.ADD
          ? initialPurchaseForm.billingCode
          : initialFormVals.billingCode,
      purchPaymentMethod:
        mode == FormMode.ADD
          ? initialPurchaseForm.purchPaymentMethod
          : initialFormVals.purchPaymentMethod,
      supplier:
        mode == FormMode.ADD
          ? initialPurchaseForm.supplier
          : initialFormVals.supplier,
      items:
        mode == FormMode.ADD
          ? initialPurchaseForm.items
          : initialFormVals.items,
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const formValues = useWatch({
    name: "items",
    control,
  });
  const gTotal = formValues.reduce(
    (acc, current) => acc + (current.total || 0),
    0
  );

  const onSubmit = async (data: IPurchaseForm) => {
    setLoading(true);

    try {
      const prm: IPurchaseForm = {
        ...data,
        id: String(id) ?? "",
      };

      const res =
        mode === FormMode.ADD
          ? await createPurchaseAPI(session, prm)
          : await editPurchaseAPI(session, prm);

      if (res && res.status == 200) {
        dispatch(
          toastActs.callShowToast({
            show: true,
            msg: (
              <div className="flex flex-col py-[1rem]">
                <span>
                  {mode === FormMode.ADD
                    ? t("API_MSG.SUCCESS.NEW_PURCHASE_CREATE")
                    : t("API_MSG.SUCCESS.PURCHASE_UPDATE")}
                </span>
              </div>
            ),
            type: "success",
            timeout: 300,
          })
        );

        setTimeout(() => {
          if (mode == FormMode.ADD) {
            router.push(`${PURCHASE_PAGE.VIEW}/${res.data.data.id}`);
          }
        }, 750);
      }
    } catch (error: any) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: error ? (
            <div className="flex flex-col py-[1rem]">
              <span>{String(error)}</span>
            </div>
          ) : (
            <div className="flex flex-col py-[1rem]">
              <span>{t("API_MSG.ERROR.UNEXPECTED_ERROR")}</span>
            </div>
          ),
          type: "error",
        })
      );
    }

    setLoading(false);
  };

  useMount(() => {
    fetchItem({
      // ...reqPrm,
      // id: mode == FormMode.EDIT ? initialFormVals.items.map(item => item.item).join(",") : "",
      limit: 50,
    });
    fetchSupp({
      limit: 50,
    });
    fetchUnit({
      limit: 20,
    });
  });

  // const purchaseForm = useForm<z.infer<typeof SupplierFormSchema>>({
  //   resolver: zodResolver(PurchaseFormSchema),
  //   defaultValues: mode == FormMode.ADD ? initialSupplierForm : initialFormVals,
  // });

  // useEffect(() => {
  //   if (mode !== FormMode.ADD && initialFormVals.id === id) {
  //     purchaseForm.setValue("billingCode", initialFormVals.billingCode);
  //   }
  // }, [id, initialFormVals.billingCode, initialFormVals.id, mode, purchaseForm]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-6">
          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.year"))}</label>
            <Input {...register("year")} placeholder="Year" />
          </div>

          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.poNo"))}</label>
            <Input {...register("poNo")} placeholder="Po No" />
          </div>
        </div>

        <div className="flex items-center gap-x-6">
          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.date"))}</label>
            <Input type="date" {...register("date")} placeholder="Date" />
          </div>

          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.expDate"))}</label>
            <Input
              type="date"
              {...register("expDate")}
              placeholder={capitalizeStr(t("PurchasePage.expDate"))}
            />
          </div>
        </div>

        <div className="flex items-center gap-x-6">
          <div className="flex-1">
            <label>Supplier</label>
            <Controller
              defaultValue={""}
              name={`supplier`}
              control={control}
              render={({ field }) => (
                <Select
                  disabled={mode == FormMode.VIEW}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        mode == FormMode.ADD
                          ? "Select Supplier"
                          : supplierOpts.find(
                              (y) => y.value == initialFormVals.supplier
                            )?.text
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {supplierOpts.map((x: Options) => {
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

          <div className="flex-1">
            <label>{capitalizeStr(t("PurchasePage.paymentMethod"))}</label>
            <Controller
              defaultValue={""}
              name={`purchPaymentMethod`}
              control={control}
              render={({ field }) => (
                <Select
                  // disabled={mode == FormMode.VIEW}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        // mode == FormMode.ADD
                        //   ? "Select Category"
                        //   : itemCatOpts.find(
                        //     (y) => y.value == initialFormVals.itemCategory
                        //   )?.text
                        capitalizeStr(t("PurchasePage.paymentMethod"))
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethOpts.map((x: Options) => {
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
        </div>

        <div className="flex items-center gap-x-6">
          <div className="flex-grow">
            <label>{capitalizeStr(t("PurchasePage.billCode"))}</label>
            <Input
              {...register("billingCode")}
              placeholder={capitalizeStr(t("PurchasePage.billCode"))}
            />
          </div>

          <div className="flex-grow">
            <label>{capitalizeStr(t("PurchasePage.soNo"))}</label>
            <Input
              {...register("soNumber")}
              placeholder={capitalizeStr(t("PurchasePage.soNo"))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-x-6">
          <label>{capitalizeStr(t("PurchasePage.note"))}</label>
          <Textarea
            {...register("note")}
            placeholder={capitalizeStr(t("PurchasePage.note"))}
          />
        </div>
      </div>

      <button
        className="ml-[0.1rem] mt-4 flex flex-row items-center rounded-[0.5rem] bg-gray-300 p-1"
        onClick={() => {
          setIsEditing(true);
          append({
            item: "",
            unit: "kg",
            quantity: 0,
            price: 0,
            discount: 0,
            total: 0,
          });
        }}
        type="button"
      >
        <AiFillPlusCircle size={25} color="green" />
        {capitalizeStr(`${t("Common.add")} ${t("Sidebar.item")}`)}
      </button>
      {fields.map((field, index) => {
        return (
          <div className="flex flex-row " key={field.id}>
            <section
              className="section mt-[0.3rem] flex w-[100%] flex-row gap-x-4"
              key={field.id}
            >
              <div className="w-[50%] flex-grow">
                {index == 0 && (
                  <>
                    Item <br />
                  </>
                )}

                <Controller
                  name={`items.${index}.item`}
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
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandList>
                            {itemDataOpts.map((language) => (
                              <CommandItem
                                value={language.text}
                                key={language.value}
                                // onSelect={field.onChange}
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

                {/* <Controller
                  defaultValue={""}
                  name={`items.${index}.item`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      // disabled={mode == FormMode.VIEW}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            mode == FormMode.ADD || isEditing
                              ? "Select Item"
                              : itemDataOpts.find(
                                (y) =>
                                  y.value == initialFormVals.items[index].item
                              )?.text
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {itemDataOpts.map((x: Options) => {
                          return (
                            <SelectItem key={x.value} value={x.value}>
                              {x.text}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                /> */}
              </div>

              <div className="w-[20%] flex-grow">
                {index == 0 && capitalizeStr(t("Sidebar.unit"))}
                <Controller
                  defaultValue={""}
                  name={`items.${index}.unit`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            mode == FormMode.ADD || isEditing
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
                {index == 0 && capitalizeStr(t("PurchasePage.price"))}
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

              <div className="flex-grow">
                {index == 0 && capitalizeStr(t("PurchasePage.quantity"))}
                <Input
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
                {index == 0 && capitalizeStr(t("PurchasePage.discount"))}
                <Input
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
                {index == 0 && "Total"}
                <Input
                  readOnly
                  placeholder="value"
                  type="text"
                  {...register(`items.${index}.total` as const, {
                    // valueAsNumber: true,
                    required: true,
                  })}
                  className={errors?.items?.[index]?.total ? "bg-red-100" : ""}
                  defaultValue={field.total}
                  value={thsandSep(getValues(`items.${index}.total`))}
                />
              </div>
              <button
                className={clsxm(index == 0 && "mt-[1.5rem]", "ml-[0.2rem]")}
                type="button"
                onClick={() => remove(index)}
              >
                <FaRegTrashAlt
                  color="red"
                  size={25}
                  onClick={() => remove(index)}
                />
              </button>
            </section>
          </div>
        );
      })}

      <div className="mr-[2.5rem] mt-[1.5rem] flex justify-end">
        <span>{`${capitalizeStr(t("PurchasePage.grandTotal"))} : Rp ${thsandSep(gTotal)}`}</span>
      </div>

      <div className="mt-[1rem] flex flex-row justify-center gap-3">
        <Button
          className="bg-primary text-white hover:bg-primary-foreground"
          type="submit"
          disabled={loading}
        >
          {loading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
          {capitalizeStr("Submit")}
        </Button>
        {/* <Button
          className="bg-gray-700 text-white hover:bg-gray-500"
          onClick={noop}
          type="reset"
          disabled={loading}
        >
          Reset
        </Button> */}
      </div>
    </form>
  );
};

export { getStaticProps };

export default PurchaseForm;
