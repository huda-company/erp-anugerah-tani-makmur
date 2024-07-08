import { initSuppReqPrm } from "^/config/supplier/config";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
  initPgPrms,
} from "@/components/PaginationCustom/config";
import { actions as toastActs } from "@/redux/toast";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getDelivNoteAPI } from "^/services/delivery-note";
import {
  DelivNoteResp,
  DelivNoteTanTblData,
  IDelivNoteGetReq,
} from "^/@types/models/deliverynote";
import { Button } from "@/components/ui/button";
import { capitalizeStr } from "^/utils/capitalizeStr";
import useAppDispatch from "../useAppDispatch";
import useCloseAlertModal from "../useCloseAlertModal";
import { useTranslations } from "next-intl";

const useGetDelivNote = () => {
  const t = useTranslations("");

  const router = useRouter();
  const { delivNoteId } = router.query;

  const dispatch = useAppDispatch();
  const { closeAlertModal } = useCloseAlertModal();

  const fetched = useRef(false);

  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] = useState<IDelivNoteGetReq>({
    ...initSuppReqPrm,
    id: delivNoteId ? String(delivNoteId) : "",
  });

  const [suppPgntn, setSuppTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);

  const {
    data: delivNoteData,
    error: delivNoteDataErr,
    isLoading: delivNoteDataLoading,
  } = useQuery<DelivNoteResp[], Error>({
    queryKey: ["deliv-note"],
    retry: 1,
    queryFn: async () => {
      const dNoteData = await fetchData(session, reqPrm);

      return dNoteData;
    },
  });

  // Adjust the query function to match the expected type
  const fetchData = async (
    session: any, // Replace with your session type
    suppStockReq: IDelivNoteGetReq // Replace with your request payload type
  ): Promise<DelivNoteResp[]> => {
    try {
      fetched.current = true;

      const response = await getDelivNoteAPI(session, suppStockReq);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error");
      }

      const { data: resData } = response;
      const suppData: DelivNoteResp[] = resData.data.items;

      queryClient.setQueryData(["deliv-note"], suppData);

      setSuppTblPgntn({
        page: resData.data.page,
        limit: resData.data.limit,
        nextPage: resData.data.nextPage,
        prevPage: resData.data.prevPage,
        totalPages: resData.data.totalPages,
      });

      return suppData;
    } catch (error) {
      throw new Error("API Error");
    }
  };

  const onPaginationChange = (prm: PaginationCustomPrms) => {
    const pgntParam: IDelivNoteGetReq = {
      ...reqPrm,
      page: prm.page,
      limit: prm.limit,
    };

    fetchData(session, pgntParam);
  };

  const handleNextClck = () => {
    const newPrms = handlePrmChangeNextBtn(suppPgntn);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const newPrms = handlePrmChangePrevBtn(suppPgntn);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const newPrms = handlePrmChangeInputPage(suppPgntn, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const newPrms = handlePrmChangeRowPage(suppPgntn, prm);
    onPaginationChange(newPrms);
  };

  const confirmDelOk = async (id: string) => {
    // eslint-disable-next-line no-console
    console.log("confirmDelOk", id);
  };

  const confirmDeletion = async (id: string) => {
    await dispatch(
      toastActs.callShowToast({
        show: true,
        msg: (
          <div className="flex flex-col pt-[1rem] capitalize">
            <h1 className="text-[1.5rem]">
              {capitalizeStr(t("Msg.areUSure"))}
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

  const data =
    delivNoteData && delivNoteData.length > 0
      ? delivNoteData.map((x: DelivNoteResp) => {
          return {
            id: String(x.id),
            branchName: x.branch.name,
            sellingTotal: x.sellingTotal,
            purchaseTotal: x.purchaseTotal,
            createdAt: x.createdAt,
            code: x.code,
            driverName: x.driverName,
          } as DelivNoteTanTblData;
        })
      : [];

  return {
    suppPgntn,
    delivNoteData,
    delivNoteDataErr,
    delivNoteDataLoading,
    data,
    reqPrm,
    setReqPrm,
    fetchData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
    confirmDeletion,
  };
};

export default useGetDelivNote;
