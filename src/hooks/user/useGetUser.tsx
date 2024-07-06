import { CustomTblBody } from "@/components/CustomTable/types";
import { Button } from "@/components/ui/button";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useAppSelector from "../useAppSelector";
import { deleteBranchAPI } from "^/services/branch";
import { IBranchFieldRequest } from "^/@types/models/branch";
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
  initPgPrms,
} from "@/components/PaginationCustom/config";
import { getUserAPI } from "^/services/user";
import { IUserGetReq, UserResp } from "^/@types/models/user";
import { formatDate } from "^/utils/dateFormatting";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import useCloseAlertModal from "../useCloseAlertModal";
import { USER } from "@/constants/pageURL";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { initUserReqPrm } from "^/config/user/config";
import { pageRowsArr } from "^/config/request/config";

const useGetUser = () => {
  const t = useTranslations("");

  const queryClient = useQueryClient();

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  const [tblBd, setTblBd] = useState<CustomTblBody[]>([]);
  const [reqPrm, setReqPrm] = useState<IUserGetReq>({
    ...initUserReqPrm,
    limit: pageRowsArr[0],
  });
  const [userPgntn, setUserTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);

  const {
    data: userData,
    error: userDataErr,
    isLoading: userDataLoading,
  } = useQuery<UserResp[], Error>({
    queryKey: ["deliv-note"],
    retry: 1,
    queryFn: async () => {
      const dNoteData = await fetchData(session, reqPrm);

      return dNoteData;
    },
    enabled: !!session && !!reqPrm,
  });

  // Adjust the query function to match the expected type
  const fetchData = async (
    session: any, // Replace with your session type
    suppStockReq: IUserGetReq // Replace with your request payload type
  ): Promise<UserResp[]> => {
    try {
      fetched.current = true;
      console.log("ffff");

      const response = await getUserAPI(session, suppStockReq);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error");
      }

      const { data: resData } = response;
      const suppData: UserResp[] = resData.data.items;

      let formattedBody: CustomTblBody[] = [];
      if (suppData && Array.isArray(suppData)) {
        formattedBody = suppData.map((x: any) => {
          return {
            items: [
              {
                value: x.name,
                className: "text-left w-[15rem]",
              },
              {
                value: x.email,
                className: "text-left w-[6rem] pl-0",
              },
              {
                value: x.phone,
                className: "text-left w-[6rem] pl-0",
              },
              {
                value: formatDate(x.birthDate),
                className: "text-left w-[6rem] pl-0",
              },
              {
                value: x.enabled ? "active" : "inactive",
                className: "text-left w-[6rem] pl-0",
              },
              {
                value: (
                  <CustomTableOptionMenu
                    rowId={x.id}
                    editURL={`${USER.PAGE.EDIT}/${x.id}`}
                    viewURL={`${USER.PAGE.VIEW}/${x.id}`}
                    confirmDel={confirmDeletion}
                  />
                ),
                className: "",
              },
            ],
          };
        });
      }
      setTblBd(formattedBody);

      queryClient.setQueryData(["user"], suppData);

      return suppData;
    } catch (error) {
      throw new Error("API Error");
    }
  };

  const confirmDelOk = async (id: string) => {
    const resDelete = await deleteBranchAPI(session, id);
    if (resDelete.data.success) {
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

  const onPaginationChange = (prm: PaginationCustomPrms) => {
    const pgntParam: Omit<IBranchFieldRequest["query"], "name"> = {
      page: prm.page,
      limit: prm.limit,
      "sort[key]": "name",
      "sort[direction]": "asc",
    };

    fetchData(session, pgntParam);
  };

  const handleNextClck = () => {
    const newPrms = handlePrmChangeNextBtn(userPgntn);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const newPrms = handlePrmChangePrevBtn(userPgntn);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const newPrms = handlePrmChangeInputPage(userPgntn, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const newPrms = handlePrmChangeRowPage(userPgntn, prm);
    onPaginationChange(newPrms);
  };

  return {
    userData,
    userDataErr,
    userDataLoading,
    fetch,
    tblBd,
    userPgntn,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  };
};

export default useGetUser;
