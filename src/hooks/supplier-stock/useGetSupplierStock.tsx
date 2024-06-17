import { ISupplierFieldRequest } from "^/@types/models/supplier";
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
import {
  ISupplierStockGetReq,
  SuppStockResp,
  SuppStockTanTblData,
} from "^/@types/models/supplierstock";
import { getSupplierStockAPI } from "^/services/supplier-stock";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useGetSupplierStock = () => {
  const router = useRouter();
  const { suppStockId } = router.query;

  const fetched = useRef(false);

  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] = useState<ISupplierStockGetReq>({
    ...initSuppReqPrm,
    id: suppStockId ? String(suppStockId) : "",
  });
  const [suppPgntn, setSuppTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);
  const [data, setData] = useState<SuppStockTanTblData[]>([]);

  const {
    data: suppStockData,
    error: suppStockDataErr,
    isLoading: suppStockDataLoading,
  } = useQuery<SuppStockResp[], Error>({
    queryKey: ["supp-stock"],
    retry: 2,
    queryFn: async () => {
      const suppStockData = await fetchSuppStockData(session, reqPrm);

      return suppStockData;
    },
  });

  // Adjust the query function to match the expected type
  const fetchSuppStockData = async (
    session: any, // Replace with your session type
    suppStockReq: ISupplierStockGetReq // Replace with your request payload type
  ): Promise<SuppStockResp[]> => {
    try {
      fetched.current = true;

      const response = await getSupplierStockAPI(session, suppStockReq);

      if (!response || (response && response.status !== 200)) {
        throw new Error("API Error");
      }

      const { data: resData } = response;
      const suppData: SuppStockResp[] = resData.data.items;

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
          ? suppData.map((x: SuppStockResp) => {
              return {
                id: String(x.id),
                itemName: x.item.name,
                suppName: x.supplier.company,
                stock: x.stock,
              } as SuppStockTanTblData;
            })
          : [];

      setData(tStackTblBd);

      return suppData;
    } catch (error) {
      throw new Error("API Error");
    }
  };

  const onPaginationChange = (prm: PaginationCustomPrms) => {
    const pgntParam: Omit<ISupplierFieldRequest["query"], "name"> = {
      ...reqPrm,
      page: prm.page,
      limit: prm.limit,
    };

    fetchSuppStockData(session, pgntParam);
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
    suppStockData,
    suppStockDataErr,
    suppStockDataLoading,
    data,
    reqPrm,
    setReqPrm,
    fetch,
    fetchSuppStockData,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
  };
};

export default useGetSupplierStock;
