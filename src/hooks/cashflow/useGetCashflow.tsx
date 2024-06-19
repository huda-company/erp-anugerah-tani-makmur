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

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { IStockGetReq } from "^/@types/models/stock";
import { getCashflowAPI } from "^/services/cashflow";
import {
  CashflowResp,
  CashflowTanTblData,
  ICashflowGetReq,
} from "^/@types/models/cashflow";

const useGetCashflow = () => {
  const router = useRouter();
  const { cashflowId } = router.query;

  const fetched = useRef(false);

  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] = useState<ICashflowGetReq>({
    ...initSuppReqPrm,
    id: cashflowId ? String(cashflowId) : "",
  });

  const [suppPgntn, setSuppTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);

  const [data, setData] = useState<CashflowTanTblData[]>([]);

  const {
    data: stockData,
    error: stockDataErr,
    isLoading: stockDataLoading,
  } = useQuery<CashflowResp[], Error>({
    queryKey: ["stock"],
    retry: 2,
    queryFn: async () => {
      const stockData = await fetchCashflowData(session, reqPrm);

      return stockData;
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
      const suppData: CashflowResp[] = resData.data.items;

      queryClient.setQueryData(["cashflow"], suppData);

      setSuppTblPgntn({
        page: resData.data.page,
        limit: resData.data.limit,
        nextPage: resData.data.nextPage,
        prevPage: resData.data.prevPage,
        totalPages: resData.data.totalPages,
      });

      const tStackTblBd =
        suppData.length > 0
          ? suppData.map((x: CashflowResp) => {
              return {
                id: String(x.id),
                branchName: x.branch.name,
                balance: x.balance,
              } as CashflowTanTblData;
            })
          : [];

      setData(tStackTblBd);

      return suppData;
    } catch (error) {
      throw new Error("API Error");
    }
  };

  const onPaginationChange = (prm: PaginationCustomPrms) => {
    const pgntParam: IStockGetReq = {
      ...reqPrm,
      page: prm.page,
      limit: prm.limit,
    };

    fetchCashflowData(session, pgntParam);
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

  return {
    suppPgntn,
    stockData,
    stockDataErr,
    stockDataLoading,
    data,
    reqPrm,
    setReqPrm,
    fetchCashflowData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  };
};

export default useGetCashflow;
