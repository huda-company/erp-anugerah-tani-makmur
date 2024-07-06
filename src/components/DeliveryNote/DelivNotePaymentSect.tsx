import { FC, useMemo } from "react";

import { useTranslations } from "next-intl";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { getStaticProps } from "^/utils/getStaticProps";
import { useSession } from "next-auth/react";
import { CustomTblData } from "../CustomTable/types";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CustomTable from "../CustomTable/CustomTable";
import Loading from "../Loading";
import useGetDelivNotePaymByDnoteId from "@/hooks/delivery-note/useGetDelivNotePaymByDnoteId";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { VscSettings } from "react-icons/vsc";
import useAppDispatch from "@/hooks/useAppDispatch";
import { actions as toastActs } from "@/redux/toast";
import { FormMode } from "^/@types/global";
import useCloseAlertModal from "@/hooks/useCloseAlertModal";
import useGetDelivNoteById from "@/hooks/delivery-note/useGetDelivNoteById";
import PaymentDelivNoteForm from "../PaymentDelivNote/PaymentDelivNoteForm";
import { noop } from "lodash";

const DelivNotePaymentSect: FC = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const { closeAlertModal } = useCloseAlertModal();

  const { status, data: session } = useSession();

  const {
    tblBd,
    delivNoteLoading: loading,
    reqPrm,
    paymPurchTotal,
    fetchPaymDelivNote,
  } = useGetDelivNotePaymByDnoteId(session);

  const { delivNote, paymPurcFormVal } = useGetDelivNoteById(session);

  const header = useMemo(
    () => [
      {
        value: capitalizeStr(t("Common.date")),
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
        value: capitalizeStr(t("PurchasePage.note")),
        className: "text-left text-xs w-[9rem] p-0",
      },
    ],
    [t]
  );

  const tblData: CustomTblData = useMemo(
    () => ({
      header: header,
      body: tblBd,
    }),
    [header, tblBd]
  );

  const onOkPaymPurchForm = () => {
    fetchPaymDelivNote(session, reqPrm);
    closeAlertModal();
  };

  const PaymDnoteDialog = async () => {
    if (delivNote && paymPurchTotal < delivNote.purchaseTotal) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col items-center pt-[1rem] capitalize">
              <span className="mb-[2rem] text-center text-[1.5rem]">
                {`${capitalizeStr(t("PurchasePage.payment"))}`}
              </span>

              <PaymentDelivNoteForm
                mode={FormMode.EDIT}
                initialFormVals={paymPurcFormVal}
                onclose={onOkPaymPurchForm}
                onSubmitOk={onOkPaymPurchForm}
                doRefresh={noop}
              />
            </div>
          ),
          type: "form",
        })
      );
    } else {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col py-[1rem]">
              <span>{capitalizeStr(t("API_MSG.ERROR.CANT_ADD_PAYMENT"))}</span>
              <span>{capitalizeStr(t("API_MSG.ERROR.NOMINAL_IS_EQUAL"))}</span>
            </div>
          ),
          type: "error",
        })
      );
    }
  };

  return (
    <>
      {status == "loading" || (loading && <Loading />)}

      {status == "authenticated" && !loading && (
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
                      <Button
                        variant="ghost"
                        className="hover:none h-6 w-6 p-0"
                      >
                        <span className="sr-only">Open menu</span>
                        <VscSettings className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          PaymDnoteDialog();
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
              <CustomTable data={tblData} />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export { getStaticPaths, getStaticProps };

export default DelivNotePaymentSect;
