import { FC, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { capitalizeStr } from "^/utils/capitalizeStr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { VscSettings } from "react-icons/vsc";
import PaymentPurchaseForm from "../PaymentPurchase/PaymentPurchaseForm";
import CustomTable from "../CustomTable/CustomTable";
import { CustomTblData } from "../CustomTable/types";
import { useTranslations } from "next-intl";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { getStaticProps } from "^/utils/getStaticProps";
import useGetPaymentPurchByPurchId from "@/hooks/purchase/useGetPaymentPurchByPurchId";
import useAppDispatch from "@/hooks/useAppDispatch";
import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useAppSelector from "@/hooks/useAppSelector";
import { useRouter } from "next/router";
import { FormMode } from "^/@types/global";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";

const PurchPaymSect: FC = () => {
  const t = useTranslations("");

  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const toast = useAppSelector(toastSelectors.toast);

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

  const closeAlertModal = async () => {
    await dispatch(
      toastActs.callShowToast({
        ...toast,
        show: false,
      })
    );
  };

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
      <CardHeader className="bg-[#EAE2E1] p-2">
        <CardTitle>
          <div className="flex justify-between">
            <span>{capitalizeStr(t("PurchasePage.purcPaymHistory"))}</span>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="bg-black hover:bg-black"
                  asChild
                >
                  <Button variant="ghost" className="hover:none h-6 w-6 p-0">
                    <span className="sr-only">Open menu</span>
                    <VscSettings className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      PaymPurchDialog();
                    }}
                  >
                    {`${capitalizeStr(t("Common.add"))} ${capitalizeStr(t("PurchasePage.purcPaymHistory"))} `}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
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
