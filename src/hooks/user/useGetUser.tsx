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

import { deleteUserAPI, getUserAPI } from "^/services/user";
import { IUserGetReq } from "^/@types/models/user";
import useCloseAlertModal from "../useCloseAlertModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { initUserReqPrm } from "^/config/user/config";

const useGetUser = () => {
  const t = useTranslations("");

  const queryClient = useQueryClient();

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  const {
    data: globFltr,
    error: globFltrErr,
    isLoading: globFltrLoading,
  } = useQuery<String, Error>({ queryKey: ["usrGlobFltr"], initialData: "" });

  const {
    data: pgntn,
    error: pgntnErr,
    isLoading: pgntnLoading,
  } = useQuery<IUserGetReq, Error>({
    queryKey: ["usrPgntn"],
    initialData: initUserReqPrm,
  });

  const {
    data: reqPrm,
    error: reqPrmErr,
    isLoading: reqPrmLoading,
  } = useQuery<IUserGetReq, Error>({
    queryKey: ["reqPrm"],
    initialData: initUserReqPrm,
  });

  const {
    data: userData,
    error: userDataErr,
    isLoading: userDataLoading,
  } = useQuery<any, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      return await fetchData(session, reqPrm);
    },
  });

  // Adjust the query function to match the expected type
  const fetchData = async (
    session: any, // Replace with your session type
    usrReq: IUserGetReq // Replace with your request payload type
  ): Promise<any> => {
    try {
      fetched.current = true;

      const response = await getUserAPI(session, usrReq);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error", response);
      }

      const { data: resData } = response;

      await queryClient.setQueryData(["user"], resData.data);

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

      return resData.data;
    } catch (error: any) {
      throw new Error("API Error", error);
    }
  };

  const confirmDelOk = async (id: string) => {
    const resDelete = await deleteUserAPI(session, id);
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

  return {
    userData,
    userDataErr,
    userDataLoading,
    reqPrm,
    reqPrmErr,
    reqPrmLoading,
    pgntn,
    pgntnErr,
    pgntnLoading,
    globFltr,
    globFltrErr,
    globFltrLoading,
    fetchData,
    confirmDeletion,
  };
};

export default useGetUser;
