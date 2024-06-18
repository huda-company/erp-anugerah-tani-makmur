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
import { getSupplierStockHistAPI } from "^/services/supplier-stock-hist";
import {
  ISupplierStockHistGetReq,
  SuppStockHistResp,
  SuppStockHistTanTblData,
} from "^/@types/models/supplierstockhist";
import { formatDate } from "^/utils/dateFormatting";
import { initSuppStockReqPrm } from "^/config/supplier-stock/config";
import { PurchaseResp } from "^/@types/models/purchase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useGetSuppStockHistBySuppStockId = () => {
  const t = useTranslations("");

  const queryClient = useQueryClient();

  const fetched = useRef(false);

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] =
    useState<ISupplierStockHistGetReq>(initSuppStockReqPrm);
  const [histPgntn, setHistTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);
  const [data, setData] = useState<SuppStockHistTanTblData[]>([]);

  const {
    data: history,
    error: historyErr,
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ["supp-stock-hist"],
    retry: 2,
    queryFn: async () => {
      const histData = await fetchSuppStockHistData(session, reqPrm);
      return histData;
    },
    enabled: !!reqPrm["param[suppStockId]"], // Only enable the query if suppStockId is set
  });

  const fetchSuppStockHistData = async (
    session: any,
    suppStockReq: ISupplierStockHistGetReq
  ): Promise<SuppStockHistResp[]> => {
    try {
      fetched.current = true;

      if (suppStockReq["param[suppStockId]"]) {
        const response = await getSupplierStockHistAPI(session, suppStockReq);

        if (!response || (response && response.status !== 200)) {
          throw new Error("API Error");
        }

        const { data: resData } = response;
        const suppData: SuppStockHistResp[] = resData.data.items;

        queryClient.setQueryData(["supp-stock-hist"], suppData);

        setHistTblPgntn({
          page: resData.data.page,
          limit: resData.data.limit,
          nextPage: resData.data.nextPage,
          prevPage: resData.data.prevPage,
          totalPages: resData.data.totalPages,
        });

        const tStackTblBd = suppData.map((x: SuppStockHistResp) => {
          const po = x.purchase as unknown as PurchaseResp;
          const modifiedPo = po as any;
          const findUnit =
            modifiedPo.items.find(
              (xx: any) => xx.item.id == x.suppStockId.item.id
            ).unit || "pp";
          return {
            id: String(x.id),
            number: x.number,
            type: capitalizeStr(t(`SuppStockTypes.${x.type}`)),
            date: formatDate(String(x.date)),
            ref: x.ref,
            poNo: po.poNo,
            poId: po.id,
            unit: findUnit,
          } as SuppStockHistTanTblData;
        });
        setData(tStackTblBd);

        return suppData;
      } else return [];
    } catch (error) {
      throw new Error("API Error");
    }
  };

  const onPaginationChange = (prm: PaginationCustomPrms) => {
    const pgntParam: ISupplierStockHistGetReq = {
      ...reqPrm,
      page: prm.page,
      limit: prm.limit,
    };

    fetchSuppStockHistData(session, pgntParam);
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
    fetchSuppStockHistData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  };
};

export default useGetSuppStockHistBySuppStockId;
