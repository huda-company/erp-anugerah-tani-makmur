import { Button } from "@/components/ui/button";

import { ISuppGetReq } from "^/@types/models/supplier";
import { initSuppReqPrm } from "^/config/supplier/config";
import { deleteSupplierAPI, getSupplierAPI } from "^/services/supplier";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useAppSelector from "../useAppSelector";
import { Options } from "^/@types/global";

import React from "react";
import useCloseAlertModal from "../useCloseAlertModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useGetSupplier = () => {
  const t = useTranslations("");

  const queryClient = useQueryClient();

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  const {
    data: pgntn,
    error: pgntnErr,
    isLoading: pgntnLoading,
  } = useQuery<ISuppGetReq, Error>({
    queryKey: ["suppPgntn"],
    initialData: initSuppReqPrm,
  });

  const {
    data: reqPrm,
    error: reqPrmErr,
    isLoading: reqPrmLoading,
  } = useQuery<ISuppGetReq, Error>({
    queryKey: ["suppReqPrm"],
    initialData: initSuppReqPrm,
  });

  const {
    data: suppData,
    error: suppDataErr,
    isLoading: suppDataLoading,
  } = useQuery<any, Error>({
    queryKey: ["supplier"],
    queryFn: async () => {
      return await fetch(reqPrm);
    },
  });

  let supplierOpts: Options[] = [];
  const fetch = async (payload: ISuppGetReq = initSuppReqPrm) => {
    fetched.current = true;
    try {
      const response = await getSupplierAPI(session, payload);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error", response);
      }

      if (response.data) {
        const { data: resData } = response;

        const newPgntnPrm = {
          limit: resData.data.limit,
          totalPages: resData.data.totalPages,
          page: resData.data.page,
          prevPage: resData.data.prevPage,
          nextPage: resData.data.nextPage,
        };

        const newReqPrm = {
          ...reqPrm,
          limit: newPgntnPrm.limit,
          totalPages: newPgntnPrm.totalPages,
          page: newPgntnPrm.page,
          prevPage: newPgntnPrm.prevPage,
          nextPage: newPgntnPrm.nextPage,
        };

        await queryClient.setQueryData(["supplier"], resData.data);

        await queryClient.setQueryData(["suppReqPrm"], newReqPrm);
      }
    } catch (error: any) {
      throw new Error("API Error", error);
    }
  };

  const confirmDelOk = async (id: string) => {
    const resDelete = await deleteSupplierAPI(session, id);
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
                {capitalizeStr(t("API_MSG.SUCCESS.SUPPLIER_DELETE"))}{" "}
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
                {t(capitalizeStr(t("API_MSG.SUCCESS.SUPPLIER_DELETE")))}
              </span>
            </div>
          ),
          timeout: 2000,
          type: "error",
        })
      );
    }
  };

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

  if (suppData) {
    const items = suppData.items;
    // build opts
    const opts =
      suppData && items.length > 0
        ? items.map((x: any) => {
            return {
              value: x.id,
              text: x.company,
            };
          })
        : [];

    supplierOpts = opts;
  }

  return {
    fetch,
    supplierOpts,
    reqPrm,
    reqPrmErr,
    reqPrmLoading,

    pgntn,
    pgntnErr,
    pgntnLoading,
    suppData,
    suppDataErr,
    suppDataLoading,

    confirmDeletion,
  };
};

export default useGetSupplier;
