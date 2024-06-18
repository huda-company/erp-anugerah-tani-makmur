import { FC, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { capitalizeStr } from "^/utils/capitalizeStr";

import PaymentPurchaseForm from "../PaymentPurchase/PaymentPurchaseForm";
import CustomTable from "../CustomTable/CustomTable";
import { CustomTblData } from "../CustomTable/types";
import { useTranslations } from "next-intl";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { getStaticProps } from "^/utils/getStaticProps";
import useGetPaymentPurchByPurchId from "@/hooks/purchase/useGetPaymentPurchByPurchId";
import useAppDispatch from "@/hooks/useAppDispatch";
import { actions as toastActs } from "@/redux/toast";
import { FormMode } from "^/@types/global";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import useCloseAlertModal from "@/hooks/useCloseAlertModal";

const PurchPaymSect: FC = () => {
  const t = useTranslations("");

  const dispatch = useAppDispatch();

  const { closeAlertModal } = useCloseAlertModal();

  const { paymPurcFormVal } = useGetPurchaseById();

  const { paymPurchReq, fetchPaymPurch, paymPurcTblBd } =
    useGetPaymentPurchByPurchId();

  const payPurchHeader = useMemo(
    () => [
      {
        value: capitalizeStr(t("PurchasePage.paymentDate")),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: capitalizeStr(t("PurchasePage.nominal")),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: capitalizeStr(t("Index.description")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: "PPB / SPAA",
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("Sidebar.item")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("Common.action")),
        className: "sticky right-0 z-20 text-left text-xs w-[3rem]",
      },
    ],
    [t]
  );

  const paymPurchTData: CustomTblData = useMemo(
    () => ({
      header: payPurchHeader,
      body: paymPurcTblBd,
    }),
    [payPurchHeader, paymPurcTblBd]
  );

  const onOkPaymPurchForm = () => {
    fetchPaymPurch(paymPurchReq);
    closeAlertModal();
  };

  const PaymPurchDialog = async () => {
    await dispatch(
      toastActs.callShowToast({
        show: true,
        msg: (
          <div className="flex flex-col items-center pt-[1rem] capitalize">
            <span className="mb-[2rem] text-center text-[1.5rem]">
              {`${capitalizeStr(t("PurchasePage.payment"))}`}
            </span>

            <PaymentPurchaseForm
              mode={FormMode.EDIT}
              initialFormVals={paymPurcFormVal}
              onclose={onOkPaymPurchForm}
              onSubmitOk={onOkPaymPurchForm}
            />
          </div>
        ),
        type: "form",
      })
    );
  };

  return (
    <Card className="">
      <CardContent>
        <div className="mt-[1rem] rounded-[1rem] bg-[#E2E7E8]">
          <CustomTable key="paymPurchTbl" data={paymPurchTData} />
        </div>
      </CardContent>
    </Card>
  );
};

export { getStaticPaths, getStaticProps };

export default PurchPaymSect;
