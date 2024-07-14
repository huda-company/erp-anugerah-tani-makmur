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
import { deleteBranchAPI, getBranchAPI } from "^/services/branch";
import { IBranchGetReq } from "^/@types/models/branch";

import useCloseAlertModal from "../useCloseAlertModal";
import { Options } from "^/@types/global";
import { initBranchReqPrm } from "^/config/branch/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useGetBranch = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  let branchOpts: Options[] = [];

  const {
    data: pgntn,
    error: pgntnErr,
    isLoading: pgntnLoading,
  } = useQuery<IBranchGetReq, Error>({
    queryKey: ["bchPgntn"],
    initialData: initBranchReqPrm,
  });

  const {
    data: reqPrm,
    error: reqPrmErr,
    isLoading: reqPrmLoading,
  } = useQuery<IBranchGetReq, Error>({
    queryKey: ["bchReqPrm"],
    initialData: initBranchReqPrm,
  });

  const {
    data: bchData,
    error: bchDataErr,
    isLoading: bchDataLoading,
  } = useQuery<any, Error>({
    queryKey: ["branch"],
    queryFn: async () => {
      return await fetch(reqPrm);
    },
  });

  const fetch = async (payload: IBranchGetReq = initBranchReqPrm) => {
    fetched.current = true;

    try {
      const response = await getBranchAPI(session, payload);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error", response);
      }

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

      await queryClient.setQueryData(["branch"], resData.data);

      await queryClient.setQueryData(["bchReqPrm"], newReqPrm);
    } catch (error: any) {
      throw new Error("API Error", error);
    }
  };

  const confirmDelOk = async (id: string) => {
    const resDelete = await deleteBranchAPI(session, id);
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
              <span> {capitalizeStr(t("API_MSG.SUCCESS.BRANCH_DELETE"))} </span>
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
              <span>{t(capitalizeStr(t("API_MSG.ERROR.BRANCH_DELETE")))}</span>
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

  if (bchData) {
    // const tStackTblBd = bchData.items.map((x: BranchResp) => {
    //   return {
    //     id: String(x.id),
    //     name: x.name,
    //     address: x.address,
    //     city: x.city,
    //     description: x.description,
    //     enabled: x.enabled,
    //     removed: x.removed,
    //     removedBy: x.removedBy,
    //   } as BranchResp;
    // });

    // build opts
    const opts =
      bchData && Array.isArray(bchData.items) && bchData.items.length > 0
        ? bchData.items.map((x: any) => {
            return {
              value: x.id,
              text: x.name,
            };
          })
        : [];

    branchOpts = opts;
  }

  return {
    fetch,
    bchData,
    bchDataErr,
    bchDataLoading,
    branchOpts,
    pgntn,
    pgntnErr,
    pgntnLoading,
    reqPrm,
    reqPrmErr,
    reqPrmLoading,
    confirmDeletion,
  };
};

export default useGetBranch;
