import { createPaymentPurchaseAPI } from "^/services/payment-purchase";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import { useRouter } from "next/router";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { IPaymentPurchaseForm } from "^/@types/models/paymentpurchase";
import { FormMode, Options } from "^/@types/global";
import { initialPaymPurchaseForm } from "^/config/payment-purchase/config";
import { Textarea } from "../ui/textarea";
import { paymentMethOpts } from "^/config/purchase/config";
import useGetItem from "@/hooks/item/useGetItem";
import useGetUnit from "@/hooks/unit/useGetUnit";
import { handleFocusSelectAll, thsandSep } from "^/utils/helpers";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import useAppDispatch from "@/hooks/useAppDispatch";
import { actions as toastActs } from "@/redux/toast";

export interface PaymentPurchaseFormProps {
  mode: FormMode;
  initialFormVals: IPaymentPurchaseForm;
  onclose: () => void;
  onSubmitOk: () => void;
}

const PaymentPurchaseForm: FC<PaymentPurchaseFormProps> = ({
  mode,
  initialFormVals,
  onSubmitOk,
}) => {
  const t = useTranslations("");

  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const { data: session } = useSession();

  // const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { itemDataOpts } = useGetItem();
  const { unitDataOpts } = useGetUnit();

  // const handleSubmitUpload = async (event: FormEvent) => {
  //   event.preventDefault();
  //   const res = await createPaymentPurchaseAPI(session, {
  //     id: String(id),
  //     // file,
  //     amount: Number(amount),
  //     paymentMode,
  //   });

  //   if (res && res.data && res.status == 200) {
  //     dispatch(
  //       toastActs.callShowToast({
  //         show: true,
  //         msg: (
  //           <div className="flex flex-col py-[1rem]">
  //             <span>{t("API_MSG.SUCCESS.PAYMENT_PURCHASE_CREATE")}</span>
  //           </div>
  //         ),
  //         type: "success",
  //         timeout: 2000,
  //       })
  //     );

  //     onSubmitOk();
  //   } else {
  //     dispatch(
  //       toastActs.callShowToast({
  //         show: true,
  //         msg: (
  //           <div className="flex flex-col py-[1rem]">
  //             <span>{t("API_MSG.ERROR.PAYMENT_PURCHASE_CREATE")}</span>
  //           </div>
  //         ),
  //         type: "success",
  //         timeout: 2000,
  //       })
  //     );
  //   }
  // };

  const onSubmit = async (data: IPaymentPurchaseForm) => {
    const prm: IPaymentPurchaseForm = {
      ...data,
      id: String(id) ?? "",
      amount: gTotal,
    };

    const res = await createPaymentPurchaseAPI(session, prm);

    if (res && res.status == 200) {
      onSubmitOk();
    } else {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>{t("API_MSG.ERROR.PAYMENT_PURCHASE_CREATE")}</span>
            </div>
          ),
          type: "success",
          timeout: 2000,
        })
      );
    }
  };

  const calculateSubtotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  const {
    register,
    setValue,
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IPaymentPurchaseForm>({
    defaultValues: {
      purchase: String(id),
      items:
        mode == FormMode.ADD
          ? initialPaymPurchaseForm.items
          : initialFormVals.items,
      amount:
        mode == FormMode.ADD
          ? initialPaymPurchaseForm.amount
          : initialFormVals.amount,
      paymentMode:
        mode == FormMode.ADD
          ? initialPaymPurchaseForm.paymentMode
          : initialFormVals.paymentMode,
      date:
        mode == FormMode.ADD
          ? initialPaymPurchaseForm.date
          : initialFormVals.date,
      description:
        mode == FormMode.ADD
          ? initialPaymPurchaseForm.description
          : initialFormVals.description,
    },
    mode: "onBlur",
  });

  const { fields } = useFieldArray({
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[2rem] flex flex-col gap-y-4">
          <div className="flex items-center gap-x-6">
            <div className="flex-1 ">
              <label>{capitalizeStr(t("PurchasePage.date"))}</label>
              <Input type="date" {...register("date")} placeholder="Date" />
            </div>

            <div className="flex-1">
              <label>{capitalizeStr(t("PurchasePage.paymentMethod"))}</label>
              <Controller
                name={`paymentMode`}
                control={control}
                render={({ field }) => (
                  <Select
                    // disabled={mode == FormMode.VIEW}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={capitalizeStr(
                          t("PurchasePage.paymentMethod")
                        )}
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

          <div className="flex flex-col gap-x-6">
            <label>{capitalizeStr(t("PurchasePage.note"))}</label>
            <Textarea
              {...register("description")}
              placeholder={capitalizeStr(t("PurchasePage.note"))}
            />
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
                  {index == 0 && "Item"}
                  <Controller
                    defaultValue={""}
                    name={`items.${index}.item`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        disabled
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              mode == FormMode.ADD
                                ? "Select Item"
                                : itemDataOpts.find(
                                    (y) =>
                                      y.value ==
                                      initialFormVals.items[index].item
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

                <div className="w-[20%] flex-grow">
                  {index == 0 && capitalizeStr(t("Sidebar.unit"))}
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
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              mode == FormMode.ADD
                                ? `${capitalizeStr(t("Sidebar.unit"))}`
                                : unitDataOpts.find(
                                    (y) =>
                                      y.text ==
                                      initialFormVals.items[index].unit
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
                    disabled
                    onFocus={handleFocusSelectAll}
                    placeholder="value"
                    type="number"
                    {...register(`items.${index}.price` as const, {
                      valueAsNumber: true,
                      required: true,
                      onChange: () => {
                        const newSubTotal = calculateSubtotal(
                          getValues(`items.${index}.quantity`),
                          getValues(`items.${index}.price`)
                        );
                        setValue(`items.${index}.total`, newSubTotal);
                      },
                    })}
                    className={
                      errors?.items?.[index]?.price ? "bg-red-100" : ""
                    }
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
                        const originQtyVal =
                          initialFormVals.items[index].quantity;
                        const currQtyVal = getValues(`items.${index}.quantity`);

                        if (currQtyVal > initialFormVals.items[index].quantity)
                          setValue(`items.${index}.quantity`, originQtyVal);

                        const newSubTotal = calculateSubtotal(
                          getValues(`items.${index}.quantity`),
                          getValues(`items.${index}.price`)
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
                  {index == 0 && "Total"}
                  <Input
                    readOnly
                    placeholder="value"
                    type="text"
                    {...register(`items.${index}.total` as const, {
                      // valueAsNumber: true,
                      required: true,
                    })}
                    className={
                      errors?.items?.[index]?.total ? "bg-red-100" : ""
                    }
                    defaultValue={field.total}
                    value={thsandSep(getValues(`items.${index}.total`))}
                  />
                </div>
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
        </div>
      </form>

      {/* <form onSubmit={handleSubmitUpload}>
        <div className="flex flex-row gap-x-2 rounded-[0.4rem]  p-1 py-[0.5rem]">
          <div className=" flex flex-row gap-x-2">
            <div>
              <Select
                onValueChange={handlePaymModeChange}
                name="paymentMode"
                defaultValue={"cash"}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={capitalizeStr(t("PurchasePage.paymentMethod"))}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="cash" value="cash">
                    cash
                  </SelectItem>
                  <SelectItem key="credit" value="credit">
                    credit
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Input type="file" onChange={handleFileChange} />

          <Input
            onChange={handleAmtChange}
            type="number"
            name="amount"
            placeholder={capitalizeStr(t("PurchasePage.nominal"))}
          />

          <div className="p-0">
            <button
              type="submit"
              className="flex h-full items-center rounded-[0.5rem] bg-none p-1"
            >
              <BsSendPlusFill className="h-6 w-6" />
            </button>
          </div>
        </div>
      </form>

      <div className="items-end justify-end">
        <AiFillCloseCircle
          color="red"
          className="h-5 w-5 cursor-pointer"
          onClick={() => onclose()}
        />
      </div> */}
    </>
  );
};

export { getStaticProps };

export default PaymentPurchaseForm;
