import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { IBranchFieldRequest } from "^/@types/models/branch";
import { getPurchaseAPI } from "^/services/purchase";
import { CustomTblBody } from "@/components/CustomTable/types";
import { IBillDocFieldRequest } from "^/@types/models/billdoc";
import { getBilldocAPI } from "^/services/billdoc";
import { IPurchaseForm } from "^/@types/models/purchase";
import { initialPurchaseForm } from "^/config/purchase/config";
import moment from "moment";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import { actions as toastActs } from "@/redux/toast";

const useGetPurchaseById = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  const [billdocs, setBillDocs] = useState<any>(null);
  const [formVal, setFormVal] = useState<IPurchaseForm>(initialPurchaseForm);
  const [tblBd, setTblBd] = useState<CustomTblBody[]>([]);

  const fetchBilldoc = useCallback(
    async (
      payload: Omit<IBillDocFieldRequest["query"], "name"> = {
        page: 1,
        limit: 0,
        purchaseid: String(id),
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      if (id) {
        try {
          const response = await getBilldocAPI(session, payload);

          if (!response || (response && response.status !== 200)) {
            setLoading(false);
            dispatch(
              toastActs.callShowToast({
                show: true,
                msg: (
                  <div className="flex flex-col py-[1rem]">
                    <span>{t("API_MSG.ERROR.UNEXPECTED_ERROR")}</span>
                  </div>
                ),
                type: "error",
              })
            );
          }

          if (response.data) {
            setBillDocs(response.data.data.items);

            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          return null;
        }
      }

      setLoading(false);
    },
    [dispatch, id, session, t]
  );

  const fetch = useCallback(
    async (
      payload: Omit<IBranchFieldRequest["query"], "name"> = {
        page: 1,
        limit: 0,
        id: String(id),
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      if (id) {
        try {
          const response = await getPurchaseAPI(session, payload);

          if (!response || (response && response.status !== 200)) {
            setLoading(false);
          }

          if (response.data) {
            const prchse = response.data.data.items[0];

            const formattedItems = prchse.items.map((entry: any) => ({
              item: entry.item.id,
              quantity: entry.quantity,
              price: entry.price,
              discount: entry.discount,
              total: entry.total,
            }));

            setPurchase(prchse);
            setFormVal({
              ...prchse,
              items: formattedItems,
              supplier: prchse.supplier.id,
              expDate: moment(prchse.expDate).format("YYYY-MM-DD"),
            });

            fetchBilldoc();

            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          return null;
        }
      }

      setLoading(false);
    },
    [fetchBilldoc, id, session]
  );

  // const onPaginationChange = useCallback(
  //   (prm: PaginationCustomPrms) => {
  //     const pgntParam: Omit<ISupplierFieldRequest["query"], "name"> = {
  //       page: prm.page,
  //       limit: prm.limit,
  //       ownerId: session?.user?.id,
  //       "sort[key]": "name",
  //       "sort[direction]": "asc"
  //     };

  //     fetch(pgntParam);
  //   },
  //   [fetch, session?.user?.id]
  // );

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  useEffect(() => {
    let formattedBody: CustomTblBody[] = [];
    if (purchase && Array.isArray(purchase.items)) {
      const { items } = purchase;
      formattedBody = items.map((x: any) => {
        return {
          items: [
            {
              value: x.item.name,
              className: "text-left w-[15rem]",
            },
            {
              value: x.price,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.quantity,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.discount,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.total,
              className: "text-left w-[6rem] pl-0",
            },
          ],
        };
      });
    }
    setTblBd(formattedBody);
  }, [purchase]);

  return { purchase, billdocs, tblBd, formVal, loading, fetch };
};

export default useGetPurchaseById;
