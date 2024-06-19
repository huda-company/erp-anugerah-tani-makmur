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
import {
  IStockGetReq,
  StockResp,
  StockTanTblData,
} from "^/@types/models/stock";
import { getStockAPI } from "^/services/stock";

const useGetStock = () => {
  const router = useRouter();
  const { suppStockId } = router.query;

  const fetched = useRef(false);

  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] = useState<IStockGetReq>({
    ...initSuppReqPrm,
    id: suppStockId ? String(suppStockId) : "",
  });

  const [suppPgntn, setSuppTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);

  const [data, setData] = useState<StockTanTblData[]>([]);

  const {
    data: stockData,
    error: stockDataErr,
    isLoading: stockDataLoading,
  } = useQuery<StockResp[], Error>({
    queryKey: ["stock"],
    retry: 2,
    queryFn: async () => {
      const stockData = await fetchStockData(session, reqPrm);

      return stockData;
    },
  });

  // Adjust the query function to match the expected type
  const fetchStockData = async (
    session: any, // Replace with your session type
    suppStockReq: IStockGetReq // Replace with your request payload type
  ): Promise<StockResp[]> => {
    try {
      fetched.current = true;

      const response = await getStockAPI(session, suppStockReq);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error");
      }

      const { data: resData } = response;
      const suppData: StockResp[] = resData.data.items;

      queryClient.setQueryData(["supp-stock"], suppData);

      setSuppTblPgntn({
        page: resData.data.page,
        limit: resData.data.limit,
        nextPage: resData.data.nextPage,
        prevPage: resData.data.prevPage,
        totalPages: resData.data.totalPages,
      });

      const tStackTblBd =
        suppData.length > 0
          ? suppData.map((x: StockResp) => {
              return {
                id: String(x.id),
                itemName: x.item.name,
                branchName: x.branch.name,
                stock: x.stock,
              } as StockTanTblData;
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

    fetchStockData(session, pgntParam);
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
    fetchStockData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  };
};

export default useGetStock;
