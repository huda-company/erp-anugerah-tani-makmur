import { useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { IBranchFieldRequest } from "^/@types/models/branch";
import { getPurchaseAPI } from "^/services/purchase";
import { CustomTblBody } from "@/components/CustomTable/types";
import { IPurchaseForm } from "^/@types/models/purchase";
import { initialPurchaseForm } from "^/config/purchase/config";
import moment from "moment";

import { thsandSep } from "^/utils/helpers";
import { useQuery } from "@tanstack/react-query";

const useGetPurchaseById = () => {
  const router = useRouter();
  const { id } = router.query;

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [formVal, setFormVal] = useState<IPurchaseForm>(initialPurchaseForm);
  const [tblBd, setTblBd] = useState<CustomTblBody[]>([]);

  const {
    data: purch,
    error: purchErr,
    isLoading: purchLoading,
  } = useQuery({
    queryKey: ["purch-detail"],
    retry: 2,
    queryFn: async () => {
      const dashStatData = await fetch();
      return dashStatData;
    },
  });

  const fetch = async (
    payload: Omit<IBranchFieldRequest["query"], "name"> = {
      page: 1,
      limit: 0,
      id: String(id),
      "sort[key]": "name",
      "sort[direction]": "asc",
    }
  ) => {
    if (!session) {
      throw new Error("No session available");
    }

    if (!fetched.current && id && session && session?.accessToken) {
      try {
        const response = await getPurchaseAPI(session, payload);

        if (response && response.data) {
          const { data: resData } = response;

          const prchse = resData.data.items[0];

          const formattedItems = prchse.items.map((entry: any) => ({
            item: entry.item.id,
            quantity: entry.quantity,
            price: entry.price,
            unit: entry.unit,
            discount: entry.discount,
            total: entry.total,
          }));

          setFormVal({
            ...prchse,
            items: formattedItems,
            supplier: prchse.supplier.id,
            expDate: moment(prchse.expDate).format("YYYY-MM-DD"),
            date: moment(prchse.date).format("YYYY-MM-DD"),
          });

          fetched.current = true;

          return prchse;
        }
      } catch (error: any) {
        throw error;
      }
    }
  };

  useEffect(() => {
    let formattedBody: CustomTblBody[] = [];
    if (purch && Array.isArray(purch.items)) {
      const { items } = purch;
      formattedBody = items.map((x: any) => {
        return {
          items: [
            {
              value: x.item.name,
              className: "text-left w-[15rem]",
            },
            {
              value: thsandSep(Number(x.price)),
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.quantity,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.unit ?? "kg",
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.discount,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: thsandSep(Number(x.total)),
              className: "text-left w-[6rem] pl-0",
            },
          ],
        };
      });
    }
    setTblBd(formattedBody);
  }, [purch]);

  return {
    tblBd,
    formVal,

    purch,
    purchErr,
    purchLoading,
    fetch,
  };
};

export default useGetPurchaseById;
