import useAppDispatch from "@/hooks/useAppDispatch";

import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { getStaticProps } from "^/utils/getStaticProps";
import { Input } from "../ui/input";
import useGetItem from "@/hooks/item/useGetItem";
import { AiFillPlusCircle } from "react-icons/ai";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { handleFocusSelectAll } from "^/utils/helpers";
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

  const { itemDataOpts } = useGetItem();
  const { supplierOpts } = useGetSupplier();

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

  const onSubmit = async (data: IPurchaseForm) => {
    setLoading(true);

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
          timeout: 2000,
        })
      );

      setTimeout(() => {
        if (mode == FormMode.ADD) {
          router.push(`${PURCHASE_PAGE.VIEW}/${res.data.data.id}`);
        }
      }, 1000);
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
  };

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
            <label>Year</label>
            <Input
              value={new Date().getFullYear()}
              {...register("year")}
              placeholder="Year"
            />
          </div>

          <div className="flex-1">
            <label>Exp Date</label>
            <Input
              {...register("expDate")}
              type="date"
              placeholder="Exp date"
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
            <label>Payment Method</label>
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
                        "Select Payment Method"
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
            <label>Billing Code</label>
            <Input {...register("billingCode")} placeholder="Billing Code" />
          </div>

          <div className="flex-grow">
            <label>SO number</label>
            <Input {...register("soNumber")} placeholder="SO number" />
          </div>
        </div>

        <div className="flex flex-col gap-x-6">
          <label>Note</label>
          <Textarea {...register("note")} placeholder="Note" />
        </div>
      </div>

      <button
        className="ml-[0.1rem] mt-4 flex flex-row items-center rounded-[0.5rem] bg-gray-300 p-1"
        onClick={() => {
          setIsEditing(true);
          append({
            item: "",
            quantity: 0,
            price: 0,
            discount: 0,
            total: 0,
          });
        }}
        type="button"
      >
        <AiFillPlusCircle size={25} color="green" />
        ADD ITEM
      </button>
      {fields.map((field, index) => {
        return (
          <div className="flex flex-row " key={field.id}>
            <section
              className="section mt-[0.3rem] flex flex-row gap-x-4"
              key={field.id}
            >
              <div className="w-[50%] flex-grow">
                {index == 0 && "Item"}
                <Controller
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
                />
              </div>

              <div className="flex-grow">
                {index == 0 && "Price"}
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
                {index == 0 && "Quantity"}
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
                {index == 0 && "Discount"}
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
                    valueAsNumber: true,
                    required: true,
                  })}
                  className={errors?.items?.[index]?.total ? "bg-red-100" : ""}
                  defaultValue={field.price * 2}
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

      {/* <Total control={control} /> */}

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
