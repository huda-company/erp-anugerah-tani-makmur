import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
  initPgPrms,
} from "@/components/PaginationCustom/config";

import { formatDate } from "^/utils/dateFormatting";
import { initSuppStockReqPrm } from "^/config/supplier-stock/config";
import { PurchaseResp } from "^/@types/models/purchase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCashflowHistAPI } from "^/services/cashflow-hist";
import {
  CashflowHistResp,
  CashflowHistTanTblData,
  ICashflowHistGetReq,
} from "^/@types/models/cashflowhist";

const useGetCashflowHistByCashflowId = () => {
  const t = useTranslations("");

  const queryClient = useQueryClient();

  const fetched = useRef(false);

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] =
    useState<ICashflowHistGetReq>(initSuppStockReqPrm);
  const [histPgntn, setHistTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);
  const [data, setData] = useState<CashflowHistTanTblData[]>([]);

  const {
    data: history,
    error: historyErr,
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ["cashflow-hist"],
    retry: 2,
    queryFn: async () => {
      const histData = await fetchStockHistData(session, reqPrm);
      return histData;
    },
    enabled: !!reqPrm["param[cashflowId]"], // Only enable the query if suppStockId is set
  });

  const fetchStockHistData = async (
    session: any,
    suppStockReq: ICashflowHistGetReq
  ): Promise<CashflowHistResp[]> => {
    try {
      fetched.current = true;

      if (suppStockReq["param[cashflowId]"]) {
        const response = await getCashflowHistAPI(session, suppStockReq);

        if (!response || (response && response.status !== 200)) {
          throw new Error("API Error");
        }

        const { data: resData } = response;
        const stockHistData: CashflowHistResp[] = resData.data.items;

        queryClient.setQueryData(["cashflow-hist"], stockHistData);

        setHistTblPgntn({
          page: resData.data.page,
          limit: resData.data.limit,
          nextPage: resData.data.nextPage,
          prevPage: resData.data.prevPage,
          totalPages: resData.data.totalPages,
        });

        const tStackTblBd = stockHistData.map((x: CashflowHistResp) => {
          const po = x.purchase as unknown as PurchaseResp;
          return {
            id: String(x.id),
            type: capitalizeStr(t(`SuppStockTypes.${x.type}`)),
            date: formatDate(String(x.date)),
            ref: x.ref,
            poNo: po.poNo,
            poId: po.id,
            amount: x.amount,
          } as CashflowHistTanTblData;
        });
        setData(tStackTblBd);

        return stockHistData;
      } else return [];
    } catch (error) {
      throw new Error("API Error");
    }
  };

  const onPaginationChange = (prm: PaginationCustomPrms) => {
    const pgntParam: ICashflowHistGetReq = {
      ...reqPrm,
      page: prm.page,
      limit: prm.limit,
    };

    fetchStockHistData(session, pgntParam);
  };

  const handleNextClck = () => {
    const newPrms = handlePrmChangeNextBtn(histPgntn);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const newPrms = handlePrmChangePrevBtn(histPgntn);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const newPrms = handlePrmChangeInputPage(histPgntn, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const newPrms = handlePrmChangeRowPage(histPgntn, prm);
    onPaginationChange(newPrms);
  };

  return {
    history,
    historyErr,
    historyLoading,
    histPgntn,
    data,
    reqPrm,
    setReqPrm,
    fetchStockHistData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  };
};

export default useGetCashflowHistByCashflowId;
