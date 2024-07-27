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
import { IItemCatGetReq, ItemCatResp } from "^/@types/models/itemcategory";
import { deleteItemCatAPI, getItemCatAPI } from "^/services/itemCategory";
import { initPgPrms } from "@/components/PaginationCustom/config";
import { initItemCatReqPrm } from "^/config/itemcategory/config";
import useCloseAlertModal from "../useCloseAlertModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Options } from "^/@types/global";

const useGetItemCat = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  const {
    data: globFltr,
    error: globFltrErr,
    isLoading: globFltrLoading,
  } = useQuery<String, Error>({
    queryKey: ["itemCatGlobFltr"],
    initialData: "",
  });

  const {
    data: pgntn,
    error: pgntnErr,
    isLoading: pgntnLoading,
  } = useQuery<IItemCatGetReq, Error>({
    queryKey: ["itemCatPgntn"],
    initialData: initPgPrms,
  });

  const {
    data: reqPrm,
    error: reqPrmErr,
    isLoading: reqPrmLoading,
  } = useQuery<IItemCatGetReq, Error>({
    queryKey: ["itemCatReqPrm"],
    initialData: initItemCatReqPrm,
  });

  const {
    data: itemCatData,
    error: itemCatDataErr,
    isLoading: itemCatDataLoading,
  } = useQuery<any, Error>({
    queryKey: ["itemCat"],
    queryFn: async () => {
      return await fetchData(session, reqPrm);
    },
  });

  // Adjust the query function to match the expected type
  const fetchData = async (
    session: any, // Replace with your session type
    payload: IItemCatGetReq // Replace with your request payload type
  ): Promise<any> => {
    try {
      fetched.current = true;

      const response = await getItemCatAPI(session, payload);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error", response);
      }

      const { data: resData } = response;

      await queryClient.setQueryData(["itemCat"], resData.data);

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

      await queryClient.setQueryData(["itemCatReqPrm"], newReqPrm);

      return resData.data;
    } catch (error: any) {
      throw new Error("API Error", error);
    }
  };

  const confirmDelOk = async (id: string) => {
    const resDelete = await deleteItemCatAPI(session, id);
    if (resDelete && resDelete.data.success) {
      await fetchData(session, reqPrm);
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
              <span> {capitalizeStr(t("API_MSG.SUCCESS.USER_DELETE"))} </span>
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
              <span>{t(capitalizeStr(t("API_MSG.ERROR.USER_DELETE")))}</span>
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

  let itemCatOpts: Options[] = [];

  if (itemCatData) {
    const items = itemCatData.items;
    // build opts
    const opts =
      itemCatData && items.length > 0
        ? items.map((x: any) => {
            return {
              value: x.id,
              text: x.name,
            };
          })
        : [];

    itemCatOpts = opts;
  }

  const tblData =
    itemCatData && itemCatData.items.length > 0
      ? itemCatData.items.map((x: ItemCatResp) => {
          return {
            id: String(x.id),
            name: x.name,
            description: x.description,
          } as ItemCatResp;
        })
      : [];

  return {
    globFltr,
    globFltrErr,
    globFltrLoading,
    pgntn,
    pgntnLoading,
    pgntnErr,
    itemCatData,
    itemCatDataErr,
    itemCatDataLoading,
    reqPrm,
    reqPrmErr,
    reqPrmLoading,
    tblData,
    itemCatOpts,
    fetchData,
    confirmDeletion,
  };
};

export default useGetItemCat;
