import { Button } from "@/components/ui/button";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useAppSelector from "../useAppSelector";
import { deletePurchaseAPI, getPurchaseAPI } from "^/services/purchase";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
  initPgPrms,
} from "@/components/PaginationCustom/config";
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import {
  IPurchaseFieldRequest,
  PurchTanTblData,
  PurchaseResp,
} from "^/@types/models/purchase";
import { pageRowsArr } from "^/config/request/config";
import { initSuppReqPrm } from "^/config/supplier/config";
import useCloseAlertModal from "../useCloseAlertModal";

const useGetPurchase = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] = useState<IPurchaseFieldRequest["query"]>({
    ...initSuppReqPrm,
    limit: pageRowsArr[0],
  });
  const [loading, setLoading] = useState(true);
  const [purchData, setPurchData] = useState<PurchaseResp[]>([]);
  const [purchPgntn, setPurchTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);
  const [data, setData] = useState<PurchTanTblData[]>([]);

  const fetch = useCallback(
    async (
      payload: Omit<IPurchaseFieldRequest["query"], "name"> = {
        page: 1,
        limit: pageRowsArr[0],
        "param[search]": "",
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      try {
        const response = await getPurchaseAPI(session, payload);

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
          const { data: resData } = response;
          const purchData: PurchaseResp[] = resData.data.items;

          setPurchData(purchData);
          setPurchTblPgntn({
            page: resData.data.page,
            limit: resData.data.limit,
            nextPage: resData.data.nextPage,
            prevPage: resData.data.prevPage,
            totalPages: resData.data.totalPages,
          });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        return null;
      }
    },
    [dispatch, session, t]
  );

  const confirmDelOk = useCallback(
    async (id: string) => {
      setLoading(true);
      const resDelete = await deletePurchaseAPI(session, id);
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
                  {capitalizeStr(t("API_MSG.SUCCESS.PURCHASE_DELETE"))}{" "}
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
                  {t(capitalizeStr(t("API_MSG.ERROR.PURCHASE_DELETE")))}
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
    },
    [closeAlertModal, confirmDelOk, dispatch, t]
  );

  const onPaginationChange = useCallback(
    (prm: PaginationCustomPrms) => {
      const pgntParam: Omit<IPurchaseFieldRequest["query"], "name"> = {
        page: prm.page,
        limit: prm.limit,
        "sort[key]": "name",
        "sort[direction]": "asc",
      };

      fetch(pgntParam);
    },
    [fetch]
  );

  const handleNextClck = () => {
    const newPrms = handlePrmChangeNextBtn(purchPgntn);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const newPrms = handlePrmChangePrevBtn(purchPgntn);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const newPrms = handlePrmChangeInputPage(purchPgntn, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const newPrms = handlePrmChangeRowPage(purchPgntn, prm);
    onPaginationChange(newPrms);
  };

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  useEffect(() => {
    if (purchData) {
      const tStackTblBd: PurchTanTblData[] = purchData.map(
        (x: PurchaseResp) => {
          return {
            id: String(x.id),
            poNo: x.poNo,
            supplierName:
              x.supplier && x.supplier.company ? x.supplier.company : "--",
            expDate: x.expDate,
            year: x.year,
            status: x.status,
          };
        }
      );
      setData(tStackTblBd);
    }
  }, [purchData]);

  return {
    loading,
    fetch,
    purchData,
    purchPgntn,
    data,
    reqPrm,
    setReqPrm,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
    onPaginationChange,
    confirmDeletion,
  };
};

export default useGetPurchase;
