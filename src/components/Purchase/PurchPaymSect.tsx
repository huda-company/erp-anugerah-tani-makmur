import { FC, useMemo, useState } from "react";
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

const PurchPaymSect: FC = () => {
  const t = useTranslations("");

  const { fetchPaymPurch, paymPurcTblBd } = useGetPaymentPurchByPurchId();

  const [showPaymPurchForm, setShowPaymPurchForm] = useState<boolean>(false);

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
        value: capitalizeStr(t("PurchasePage.paymentMethod")),
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

  const handlePaymPurchFormClose = async () => {
    setShowPaymPurchForm(false);
    await fetchPaymPurch();
  };
  return (
    <Card className="w-1/2 ">
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
                      setShowPaymPurchForm(true);
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
        {showPaymPurchForm && (
          <div className="mt-[0.5rem] flex w-fit flex-row gap-x-4 rounded-[0.5rem] bg-[#E0EDF0] p-1">
            <PaymentPurchaseForm
              onclose={() => setShowPaymPurchForm(false)}
              onSubmitOk={() => handlePaymPurchFormClose()}
            />
          </div>
        )}
        <div className="mt-[1rem] rounded-[1rem] bg-[#E2E7E8]">
          <CustomTable key="paymPurchTbl" data={paymPurchTData} />
        </div>
      </CardContent>
    </Card>
  );
};

export { getStaticPaths, getStaticProps };

export default PurchPaymSect;
