import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { IBranchFieldRequest } from "^/@types/models/branch";
import { getPurchaseAPI } from "^/services/purchase";
import { CustomTblBody } from "@/components/CustomTable/types";
import { IBillDocFieldRequest } from "^/@types/models/billdoc";
import { getBilldocAPI } from "^/services/billdoc";
import { IPurchaseForm } from "^/@types/models/purchase";
import { initialPurchaseForm } from "^/config/purchase/config";
import moment from "moment";
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
const useGetPurchaseById = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const toast = useAppSelector(toastSelectors.toast);

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  const [billdocs, setBillDocs] = useState<any>(null);
  const [paymPurch, setPaymPurch] = useState<any>(null);
  const [paymPurchTotal, setPaymPurchtotal] = useState<number>(0);
  const [formVal, setFormVal] = useState<IPurchaseForm>(initialPurchaseForm);
  const [tblBd, setTblBd] = useState<CustomTblBody[]>([]);
  const [paymPurcTblBd, setPaymPurcTblBd] = useState<CustomTblBody[]>([]);

  const fetchBilldoc = useCallback(
    async (
      payload: Omit<IBillDocFieldRequest["query"], "name"> = {
        page: 1,
        limit: 0,
        purchaseid: String(id),
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      if (id) {
        try {
          const response = await getBilldocAPI(session, payload);

          if (!response || (response && response.status !== 200)) {
            setLoading(false);
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

          if (response.data) {
            setBillDocs(response.data.data.items);

            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          return null;
        }
      }

      setLoading(false);
    },
    [dispatch, id, session, t]
  );

  const fetchPaymPurch = useCallback(
    async (
      payload: Omit<IPaymentPurchaseFieldRequest["query"], "name"> = {
        page: 1,
        limit: 0,
        purchaseid: String(id),
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      if (id) {
        try {
          const response = await getPaymentPurchaseAPI(session, payload);

          if (!response || (response && response.status !== 200)) {
            setLoading(false);
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

          if (response.data) {
            const { data: paymPurchData } = response.data;
            const calcPaymPurch = paymPurchData.items.reduce(
              (acc: any, doc: any) => acc + doc.amount,
              0
            );
            setPaymPurchtotal(calcPaymPurch);
            setPaymPurch(paymPurchData);

            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          return null;
        }
      }

      setLoading(false);
    },
    [dispatch, id, session, t]
  );

  const fetch = useCallback(
    async (
      payload: Omit<IBranchFieldRequest["query"], "name"> = {
        page: 1,
        limit: 0,
        id: String(id),
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      if (id) {
        try {
          const response = await getPurchaseAPI(session, payload);

          if (!response || (response && response.status !== 200)) {
            setLoading(false);
          }

          if (response.data) {
            const prchse = response.data.data.items[0];

            const formattedItems = prchse.items.map((entry: any) => ({
              item: entry.item.id,
              quantity: entry.quantity,
              price: entry.price,
              unit: entry.unit,
              discount: entry.discount,
              total: entry.total,
            }));

            setPurchase(prchse);
            setFormVal({
              ...prchse,
              items: formattedItems,
              supplier: prchse.supplier.id,
              expDate: moment(prchse.expDate).format("YYYY-MM-DD"),
              date: moment(prchse.date).format("YYYY-MM-DD"),
            });

            fetchBilldoc();
            fetchPaymPurch();

            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          return null;
        }
      }

      setLoading(false);
    },
    [fetchBilldoc, fetchPaymPurch, id, session]
  );

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
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  useEffect(() => {
    let formattedBody: CustomTblBody[] = [];
    if (purchase && Array.isArray(purchase.items)) {
      const { items } = purchase;
      formattedBody = items.map((x: any) => {
        return {
          items: [
            {
              value: x.item.name,
              className: "text-left w-[15rem]",
            },
            {
              value: thsandSep(Number(x.price)),
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.quantity,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.unit ?? "kg",
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.discount,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: thsandSep(Number(x.total)),
              className: "text-left w-[6rem] pl-0",
            },
          ],
        };
      });
    }
    setTblBd(formattedBody);
  }, [purchase]);

  useEffect(() => {
    let formattedBody: CustomTblBody[] = [];
    if (paymPurch && Array.isArray(paymPurch.items)) {
      const { items } = paymPurch;
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
  }, [confirmDeletion, paymPurch]);

  return {
    purchase,
    billdocs,
    paymPurch,
    paymPurchTotal,
    tblBd,
    paymPurcTblBd,
    formVal,
    loading,
    fetch,
    fetchPaymPurch,
  };
};

export default useGetPurchaseById;
