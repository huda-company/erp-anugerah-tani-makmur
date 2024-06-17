import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { CustomTblBody } from "@/components/CustomTable/types";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import {
  IPaymPurchGetReq,
  IPaymentPurchaseFieldRequest,
  PaymentPurchaseResp,
} from "^/@types/models/paymentpurchase";
import {
  deletePaymentPurchaseAPI,
  getPaymentPurchaseAPI,
} from "^/services/payment-purchase";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Button } from "@/components/ui/button";
import useAppSelector from "../useAppSelector";
import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useGetPurchaseById from "./useGetPurchaseById";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "^/utils/dateFormatting";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { thsandSep } from "^/utils/helpers";
import PickupDocForm from "@/components/PickupDoc/PickupDocForm";
import { initialPickupDocForm } from "^/config/pickup-doc/config";
import { FormMode } from "^/@types/global";
import ItemCol from "@/components/PaymentPurchase/ItemCol";
import { calculatePaymPurchTotal } from "^/config/purchase/config";
import useCloseAlertModal from "../useCloseAlertModal";

const useGetPaymentPurchByPurchId = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const router = useRouter();
  const { id } = router.query;

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { fetch } = useGetPurchaseById();

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [paymPurchReq, setPaymPurchReq] = useState<IPaymPurchGetReq>({
    page: 1,
    limit: 20,
    purchaseid: String(id),
    "sort[key]": "name",
    "sort[direction]": "asc",
  });

  let paymPurchTotal = 0;

  const {
    data: paymPurchData,
    error: paymPurchDataErr,
    isLoading: paymPurchDataLoading,
  } = useQuery({
    queryKey: ["paym-purch-by-purchid"],
    retry: 2,
    queryFn: async () => {
      const paymPurchData = await fetchPaymPurch(paymPurchReq);

      paymPurchTotal = calculatePaymPurchTotal(paymPurchData.items);

      return paymPurchData;
    },
  });

  const fetchPaymPurch = async (
    payload: Omit<IPaymentPurchaseFieldRequest["query"], "name">
  ) => {
    setLoading(true);

    if (!session || !id) {
      throw new Error("No session available");
    }

    try {
      const response = await getPaymentPurchaseAPI(session, payload);

      if (response && response.data) {
        const { data: resData } = response;

        queryClient.setQueryData(["paym-purch-by-purchid"], resData.data);

        paymPurchTotal = calculatePaymPurchTotal(resData.data.items);

        return resData.data;
      }
    } catch (error: any) {
      throw error;
    }
  };

  const confirmDelOk = useCallback(
    async (id: string) => {
      setLoading(true);

      try {
        const resDelete = await deletePaymentPurchaseAPI(session, id);
        if (resDelete.data.success) {
          await fetch();
          await dispatch(
            toastActs.callShowToast({
              ...toast,
              show: false,
            })
          );
          await dispatch(
            toastActs.callShowToast({
              show: true,
              msg: (
                <div className="flex flex-col py-[1rem]">
                  <span>
                    {" "}
                    {capitalizeStr(
                      t("API_MSG.SUCCESS.PAYMENT_PURCHASE_DELETE")
                    )}{" "}
                  </span>
                </div>
              ),
              type: "success",
            })
          );
        } else {
          await dispatch(
            toastActs.callShowToast({
              ...toast,
              show: true,
              msg: (
                <div className="flex flex-col py-[1rem] capitalize">
                  <span>
                    {t(
                      capitalizeStr(t("API_MSG.ERROR.PAYMENT_PURCHASE_DELETE"))
                    )}
                  </span>
                </div>
              ),
              timeout: 2000,
              type: "error",
            })
          );
        }
      } catch (error) {
        await dispatch(
          toastActs.callShowToast({
            ...toast,
            show: true,
            msg: (
              <div className="flex flex-col py-[1rem] capitalize">
                <span>
                  {t(capitalizeStr(t("API_MSG.ERROR.PAYMENT_PURCHASE_DELETE")))}
                </span>
              </div>
            ),
            timeout: 2000,
            type: "error",
          })
        );
      }

      setLoading(false);
    },
    [dispatch, fetch, session, t, toast]
  );

  const confirmDeletion = async (id: string) => {
    await dispatch(
      toastActs.callShowToast({
        show: true,
        msg: (
          <div className="flex flex-col pt-[1rem] capitalize">
            <h1 className="text-[1.5rem]">
              {t(capitalizeStr(t("Msg.areUSure")))}
            </h1>
            <div className="mt-[1rem] flex flex-row justify-center gap-4 text-white">
              <Button onClick={() => confirmDelOk(id)} variant="destructive">
                {capitalizeStr(t("Common.delete"))}
              </Button>
              <Button onClick={closeAlertModal} type="reset">
                {capitalizeStr(t("Common.cancel"))}
              </Button>
            </div>
          </div>
        ),
        type: "confirm",
      })
    );
  };

  const onOkPickupDocForm = () => {
    fetchPaymPurch(paymPurchReq);
    closeAlertModal();
  };

  const PickupDocDialog = async (id: string) => {
    await dispatch(
      toastActs.callShowToast({
        show: true,
        msg: (
          <div className="flex flex-col items-center pt-[1rem] capitalize">
            <span className="mb-[2rem] text-center text-[1.5rem]">
              {`${t(capitalizeStr(t("PurchasePage.pickupDoc")))} ( PPB / SPAA )`}
            </span>

            <div className="w-full">
              <PickupDocForm
                key="pikcupDocForm"
                mode={FormMode.ADD}
                initialFormVals={{ ...initialPickupDocForm, id: id }}
                doRefresh={onOkPickupDocForm}
                onSubmitOk={onOkPickupDocForm}
                onclose={onOkPickupDocForm}
              />
            </div>
          </div>
        ),
        type: "form",
      })
    );
  };

  let paymPurcTblBd: CustomTblBody[] = [];
  const paymPurchDataItems: PaymentPurchaseResp[] = paymPurchData
    ? paymPurchData.items
    : [];

  if (
    paymPurchDataItems &&
    Array.isArray(paymPurchDataItems) &&
    paymPurchDataItems.length > 0
  ) {
    paymPurcTblBd = paymPurchDataItems.map((x: PaymentPurchaseResp) => {
      return {
        items: [
          {
            value: formatDate(String(x.date)),
            className: "text-left w-[15rem]",
          },
          {
            value: thsandSep(Number(x.amount)),
            className: "text-left w-[6rem] pl-0",
          },
          {
            value: x.description,
            className: "text-left w-[6rem] pl-0",
          },
          {
            value: x.pickupDocs ? x.pickupDocs.type : "-",
            className: "text-left w-[6rem] pl-0",
          },
          {
            value: <ItemCol items={x.items} />,
            className: "text-left w-[6rem] pl-0",
          },
          {
            value: (
              <CustomTableOptionMenu
                rowId={String(x._id)}
                addPickupDoc={
                  x.pickupDocs
                    ? undefined
                    : () => PickupDocDialog(String(x._id))
                }
                confirmDel={confirmDeletion}
              />
            ),
            className: "",
          },
        ],
      };
    });
    paymPurchTotal = calculatePaymPurchTotal(paymPurchData.items);
  }

  return {
    paymPurchTotal,
    paymPurcTblBd,
    loading,
    paymPurchReq,

    paymPurchData,
    paymPurchDataErr,
    paymPurchDataLoading,
    setPaymPurchReq,
    fetchPaymPurch,
  };
};

export default useGetPaymentPurchByPurchId;
