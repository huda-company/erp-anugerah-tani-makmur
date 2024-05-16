import { useCallback, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { CustomTblBody } from "@/components/CustomTable/types";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import { thsandSep } from "^/utils/helpers";
import { IPaymentPurchaseFieldRequest } from "^/@types/models/paymentpurchase";
import {
  deletePaymentPurchaseAPI,
  getPaymentPurchaseAPI,
} from "^/services/payment-purchase";
import { formatDate } from "^/utils/dateFormatting";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Button } from "@/components/ui/button";
import useAppSelector from "../useAppSelector";
import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useGetPurchaseById from "./useGetPurchaseById";
import { useQuery } from "@tanstack/react-query";

const useGetPaymentPurchByPurchId = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const toast = useAppSelector(toastSelectors.toast);

  const { fetch } = useGetPurchaseById();

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [paymPurchTotal, setPaymPurchtotal] = useState<number>(0);
  const [paymPurcTblBd, setPaymPurcTblBd] = useState<CustomTblBody[]>([]);

  const {
    data: paymPurchData,
    error: paymPurchDataErr,
    isLoading: paymPurchDataLoading,
  } = useQuery({
    queryKey: ["paym-purch-by-purchid"],
    retry: 2,
    queryFn: async () => {
      const paymPurchData = await fetchPaymPurch();

      const calcPaymPurch = paymPurchData.items.reduce(
        (acc: any, doc: any) => acc + doc.amount,
        0
      );

      setPaymPurchtotal(calcPaymPurch);

      return paymPurchData;
    },
  });

  const fetchPaymPurch = async (
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
      const response = await getPaymentPurchaseAPI(session, payload);

      if (response && response.data) {
        const { data: resData } = response;
        return resData.data;
      }
    } catch (error: any) {
      throw error;
    }
  };

  const closeAlertModal = useCallback(async () => {
    await dispatch(
      toastActs.callShowToast({
        ...toast,
        show: false,
      })
    );
  }, [dispatch, toast]);

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

  const confirmDeletion = useCallback(
    async (id: string) => {
      await dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col pt-[1rem] capitalize">
              <h1 className="text-[1.5rem]">
                {t(capitalizeStr(t("Msg.areUSure")))}
              </h1>
              <div className="mt-[1rem] flex flex-row justify-center gap-4 text-white">
                <Button
                  onClick={() => confirmDelOk(id)}
                  className="bg-destructive text-white"
                >
                  {capitalizeStr(t("Common.delete"))}
                </Button>
                <Button
                  className="text-white"
                  onClick={closeAlertModal}
                  type="reset"
                >
                  {capitalizeStr(t("Common.cancel"))}
                </Button>
              </div>
            </div>
          ),
          type: "confirm",
        })
      );
    },
    [closeAlertModal, confirmDelOk, dispatch, t]
  );

  useEffect(() => {
    let formattedBody: CustomTblBody[] = [];
    if (paymPurchData && Array.isArray(paymPurchData.items)) {
      const { items } = paymPurchData;
      formattedBody = items.map((x: any) => {
        return {
          items: [
            {
              value: formatDate(x.date),
              className: "text-left w-[15rem]",
            },
            {
              value: thsandSep(Number(x.amount)),
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.paymentMode.name,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: (
                <CustomTableOptionMenu
                  rowId={x.id}
                  confirmDel={confirmDeletion}
                />
              ),
              className: "",
            },
          ],
        };
      });
    }
    setPaymPurcTblBd(formattedBody);
  }, [confirmDeletion, paymPurchData]);

  return {
    paymPurchTotal,
    paymPurcTblBd,
    loading,

    paymPurchData,
    paymPurchDataErr,
    paymPurchDataLoading,
    fetchPaymPurch,
  };
};

export default useGetPaymentPurchByPurchId;
