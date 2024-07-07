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
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
} from "@/components/PaginationCustom/config";
import { deleteUserAPI, getUserAPI } from "^/services/user";
import { IUserGetReq } from "^/@types/models/user";
import useCloseAlertModal from "../useCloseAlertModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  convGetReqToPgntCustomProps,
  initUserReqPrm,
} from "^/config/user/config";

const useGetUser = () => {
  const t = useTranslations("");

  const queryClient = useQueryClient();

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

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
    queryKey: ["user", reqPrm],
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
        throw new Error("API Error");
      }

      const { data: resData } = response;

      await queryClient.setQueryData(["user"], resData.data);

      const newReqPrm = {
        ...reqPrm,
        limit: resData.data.limit,
        totalPages: resData.data.totalPages,
        page: resData.data.page,
        prevPage: resData.data.prevPage,
        nextPage: resData.data.nextPage,
      };

      await queryClient.setQueryData(["reqPrm"], newReqPrm);
      // await queryClient.invalidateQueries({ queryKey: ['reqPrm'] })
      // await queryClient.invalidateQueries({ queryKey: ['user'] })

      return resData.data;
    } catch (error) {
      throw new Error("API Error");
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

  const onPaginationChange = async (prm: PaginationCustomPrms) => {
    const pgntParam: IUserGetReq = {
      ...reqPrm,
      page: prm.page,
      limit: prm.limit,
    };

    // await queryClient.setQueryData(["reqPrm"], pgntParam);
    await fetchData(session, pgntParam);
  };

  const handleNextClck = () => {
    const pgReq: PaginationCustomPrms = convGetReqToPgntCustomProps(reqPrm);
    const newPrms = handlePrmChangeNextBtn(pgReq);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const pgReq: PaginationCustomPrms = convGetReqToPgntCustomProps(reqPrm);
    const newPrms = handlePrmChangePrevBtn(pgReq);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const pgReq: PaginationCustomPrms = convGetReqToPgntCustomProps(reqPrm);
    const newPrms = handlePrmChangeInputPage(pgReq, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const pgReq: PaginationCustomPrms = convGetReqToPgntCustomProps(reqPrm);
    const newPrms = handlePrmChangeRowPage(pgReq, prm);
    onPaginationChange(newPrms);
  };

  const handleSetReqPrm = (prm: IUserGetReq) => {
    queryClient.setQueryData(["reqPrm"], prm);
  };

  return {
    userData,
    userDataErr,
    userDataLoading,
    fetchData,
    reqPrm,
    reqPrmErr,
    reqPrmLoading,
    handleSetReqPrm,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
    confirmDeletion,
  };
};

export default useGetUser;
