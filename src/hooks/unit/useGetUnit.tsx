import { Button } from "@/components/ui/button";

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

import { deleteUnitAPI, getUnitAPI } from "^/services/unit";
import { IUnitGetReq } from "^/@types/models/unit";
import { Options } from "^/@types/global";
import { initSuppReqPrm } from "^/config/supplier/config";
import useCloseAlertModal from "../useCloseAlertModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useGetUnit = () => {
  const t = useTranslations("");
  const queryClient = useQueryClient();

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  let unitDataOpts: Options[] = [];

  const {
    data: globFltr,
    error: globFltrErr,
    isLoading: globFltrLoading,
  } = useQuery<String, Error>({ queryKey: ["untGlobFltr"], initialData: "" });

  const {
    data: pgntn,
    error: pgntnErr,
    isLoading: pgntnLoading,
  } = useQuery<IUnitGetReq, Error>({
    queryKey: ["untPgntn"],
    initialData: initSuppReqPrm,
  });

  const {
    data: reqPrm,
    error: reqPrmErr,
    isLoading: reqPrmLoading,
  } = useQuery<IUnitGetReq, Error>({
    queryKey: ["reqPrm"],
    initialData: initSuppReqPrm,
  });

  const {
    data: unitData,
    error: unitDataErr,
    isLoading: unitDataLoading,
  } = useQuery<any, Error>({
    queryKey: ["unit"],
    queryFn: async () => {
      return await fetch(reqPrm);
    },
  });

  const fetch = async (payload: IUnitGetReq = initSuppReqPrm) => {
    fetched.current = true;

    try {
      const response = await getUnitAPI(session, payload);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error", response);
      }

      const { data: resData } = response;
      await queryClient.setQueryData(["unit"], resData.data);

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

      await queryClient.setQueryData(["reqPrm"], newReqPrm);
    } catch (error: any) {
      throw new Error("API Error", error);
    }
  };

  const confirmDelOk = async (id: string) => {
    const resDelete = await deleteUnitAPI(session, id);
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
              <span> {capitalizeStr(t("API_MSG.SUCCESS.UNIT_DELETE"))} </span>
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
              <span>{t(capitalizeStr(t("API_MSG.ERROR.UNIT_DELETE")))}</span>
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

  if (unitData) {
    const items = unitData.items;
    // build opts
    const opts =
      unitData && Array.isArray(items) && items.length > 0
        ? items.map((x: any) => {
            return {
              value: x.name,
              text: x.name,
            };
          })
        : [];
    unitDataOpts = opts;
  }

  return {
    fetch,
    unitDataOpts,
    reqPrm,
    reqPrmLoading,
    reqPrmErr,

    globFltr,
    globFltrErr,
    globFltrLoading,
    pgntn,
    pgntnLoading,
    pgntnErr,
    unitData,
    unitDataErr,
    unitDataLoading,
    confirmDeletion,
  };
};

export default useGetUnit;
