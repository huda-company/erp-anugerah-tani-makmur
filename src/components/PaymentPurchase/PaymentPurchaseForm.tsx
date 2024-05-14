import { createPaymentPurchaseAPI } from "^/services/payment-purchase";
import { useSession } from "next-auth/react";
import { FC, FormEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Input } from "../ui/input";
import { BsSendPlusFill } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { useTranslations } from "next-intl";
import { getStaticProps } from "^/utils/getStaticProps";
import useAppDispatch from "@/hooks/useAppDispatch";
import { actions as toastActs } from "@/redux/toast";
import { useRouter } from "next/router";

export interface PaymentPurchaseFormProps {
  onclose: () => void;
  onSubmitOk: () => void;
}

const PaymentPurchaseForm: FC<PaymentPurchaseFormProps> = ({
  onclose,
  onSubmitOk,
}) => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const { data: session } = useSession();

  // const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("cash");

  const handleSubmitUpload = async (event: FormEvent) => {
    event.preventDefault();
    const res = await createPaymentPurchaseAPI(session, {
      id: String(id),
      // file,
      amount: Number(amount),
      paymentMode,
    });

    if (res && res.data && res.status == 200) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>{t("API_MSG.SUCCESS.PAYMENT_PURCHASE_CREATE")}</span>
            </div>
          ),
          type: "success",
          timeout: 2000,
        })
      );

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

  const handleAmtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  };

  const handlePaymModeChange = (val: string) => {
    setPaymentMode(val);
  };
  return (
    <>
      <form onSubmit={handleSubmitUpload}>
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

          {/* <Input type="file" onChange={handleFileChange} /> */}

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
      </div>
    </>
  );
};

export { getStaticProps };

export default PaymentPurchaseForm;
