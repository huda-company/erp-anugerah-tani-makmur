import { useSession } from "next-auth/react";
import { useRef } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getCashflowAPI } from "^/services/cashflow";
import {
  CashflowResp,
  CashflowTanTblData,
  ICashflowGetReq,
} from "^/@types/models/cashflow";
import { initCflReqPrm } from "^/config/cashflow/config";

const useGetCashflow = () => {
  const router = useRouter();
  const { cashflowId } = router.query;

  const fetched = useRef(false);

  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const initCflReqPrmVal = {
    ...initCflReqPrm,
    id: cashflowId ? String(cashflowId) : "",
  };

  const {
    data: pgntn,
    error: pgntnErr,
    isLoading: pgntnLoading,
  } = useQuery<ICashflowGetReq, Error>({
    queryKey: ["cflPgntn"],
    initialData: initCflReqPrmVal,
  });

  const {
    data: reqPrm,
    error: reqPrmErr,
    isLoading: reqPrmLoading,
  } = useQuery<ICashflowGetReq, Error>({
    queryKey: ["cflReqPrm"],
    initialData: initCflReqPrmVal,
  });

  const {
    data: cflData,
    error: cflDataErr,
    isLoading: cflDataLoading,
  } = useQuery<any, Error>({
    queryKey: ["cashflow"],
    queryFn: async () => {
      return await fetchCashflowData(session, reqPrm);
    },
  });

  // Adjust the query function to match the expected type
  const fetchCashflowData = async (
    session: any, // Replace with your session type
    suppStockReq: ICashflowGetReq // Replace with your request payload type
  ): Promise<CashflowResp[]> => {
    try {
      fetched.current = true;

      const response = await getCashflowAPI(session, suppStockReq);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error");
      }

      const { data: resData } = response;
      const cashflowData: CashflowResp[] = resData.data;

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

      queryClient.setQueryData(["cashflow"], cashflowData);
      queryClient.setQueryData(["cflReqPrm"], newReqPrm);

      return cashflowData;
    } catch (error) {
      throw new Error("API Error");
    }
  };

  //mapping for table data
  const data =
    cflData && cflData.items.length > 0
      ? cflData.items.map((x: CashflowResp) => {
          return {
            id: String(x.id),
            branchName: x.branch.name,
            balance: x.balance,
          } as CashflowTanTblData;
        })
      : [];

  return {
    cflData,
    cflDataErr,
    cflDataLoading,
    pgntn,
    pgntnErr,
    pgntnLoading,
    reqPrm,
    reqPrmErr,
    reqPrmLoading,
    data,
    fetchCashflowData,
  };
};

export default useGetCashflow;
