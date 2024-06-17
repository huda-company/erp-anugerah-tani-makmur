import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { CustomTblBody } from "@/components/CustomTable/types";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import { IPaymentPurchaseFieldRequest } from "^/@types/models/paymentpurchase";
import { deletePaymentPurchaseAPI } from "^/services/payment-purchase";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Button } from "@/components/ui/button";
import useAppSelector from "../useAppSelector";
import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useGetPurchaseById from "./useGetPurchaseById";
import { useQuery } from "@tanstack/react-query";
import { getPickupDocAPI } from "^/services/pickup-doc";
import { formatDate } from "^/utils/dateFormatting";
import { thsandSep } from "^/utils/helpers";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import useCloseAlertModal from "../useCloseAlertModal";

const useGetPickupDocByPurchId = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { fetch } = useGetPurchaseById();

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [paymPurchTotal, setPaymPurchtotal] = useState<number>(0);

  const {
    data: pickupDochData,
    error: pickupDochDataErr,
    isLoading: pickupDochDataLoading,
  } = useQuery({
    queryKey: ["pickup-doc-by-purchid"],
    retry: 2,
    queryFn: async () => {
      const paymPurchData = await fetchPickupDoc();

      const calcPaymPurch = paymPurchData.items.reduce(
        (acc: any, doc: any) => acc + doc.amount,
        0
      );

      setPaymPurchtotal(calcPaymPurch);

      return paymPurchData;
    },
  });

  const fetchPickupDoc = async (
    payload: Omit<IPaymentPurchaseFieldRequest["query"], "name"> = {
      page: 1,
      limit: 0,
      purchaseid: String(id),
      "sort[key]": "name",
      "sort[direction]": "asc",
    }
  ) => {
    setLoading(true);

    if (!session || !id) {
      throw new Error("No session available");
    }

    try {
      const response = await getPickupDocAPI(session, payload);

      if (response && response.data) {
        const { data: resData } = response;
        return resData.data;
      }
    } catch (error: any) {
      throw error;
    }
  };

  const confirmDelOk = useCallback(
    async (id: string) => {
      setLoading(true);
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

  let paymPurcTblBd: CustomTblBody[] = [];
  if (pickupDochData && Array.isArray(pickupDochData.items)) {
    const { items } = pickupDochData;
    paymPurcTblBd = items.map((x: any) => {
      return {
        items: [
          {
            value: formatDate(x.date),
            className: "text-left w-[15rem]",
          },
          {
            value: thsandSep(Number(x.quantity)),
            className: "text-left w-[6rem] pl-0",
          },
          {
            value: x.paymentPurchase.id,
            className: "text-left w-[6rem] pl-0",
          },
          {
            value: x.type,
            className: "text-left w-[6rem] pl-0",
          },
          {
            value: (
              <CustomTableOptionMenu
                rowId={x.id}
                doGenPdf={confirmDeletion}
                confirmDel={confirmDeletion}
              />
            ),
            className: "",
          },
        ],
      };
    });
  }

  return {
    paymPurchTotal,
    paymPurcTblBd,
    loading,

    pickupDochData,
    pickupDochDataErr,
    pickupDochDataLoading,
    fetchPickupDoc,
  };
};

export default useGetPickupDocByPurchId;
