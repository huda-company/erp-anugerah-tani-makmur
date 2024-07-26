import { initSuppReqPrm } from "^/config/supplier/config";
import { useSession } from "next-auth/react";
import { useRef } from "react";

import { initPgPrms } from "@/components/PaginationCustom/config";
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

  const {
    data: reqPrm,
    error: reqPrmErr,
    isLoading: reqPrmLoading,
  } = useQuery<IDelivNoteGetReq, Error>({
    queryKey: ["delivNoteReqPrm"],
    initialData: {
      ...initSuppReqPrm,
      id: delivNoteId ? String(delivNoteId) : "",
    },
  });

  const {
    data: pgntn,
    error: pgntnErr,
    isLoading: pgntnLoading,
  } = useQuery<IDelivNoteGetReq, Error>({
    queryKey: ["delivNotePgntn"],
    initialData: initPgPrms,
  });

  const {
    data: delivNoteData,
    error: delivNoteDataErr,
    isLoading: delivNoteDataLoading,
  } = useQuery<any, Error>({
    queryKey: ["delivNote"],
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
      const cashflowData: DelivNoteResp[] = resData.data;

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

      queryClient.setQueryData(["delivNote"], cashflowData);
      queryClient.setQueryData(["delivNoteReqPrm"], newReqPrm);

      return cashflowData;
    } catch (error) {
      throw new Error("API Error");
    }
  };

  const confirmDelOk = async (id: string) => {
    return id;
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

  const tblData =
    delivNoteData && delivNoteData.items.length > 0
      ? delivNoteData.items.map((x: DelivNoteResp) => {
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
    delivNoteData,
    delivNoteDataErr,
    delivNoteDataLoading,
    reqPrm,
    reqPrmErr,
    reqPrmLoading,
    pgntn,
    pgntnErr,
    pgntnLoading,
    tblData,
    fetchData,
    confirmDeletion,
  };
};

export default useGetDelivNote;
