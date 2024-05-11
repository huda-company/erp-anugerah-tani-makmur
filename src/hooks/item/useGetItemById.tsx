import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getItemAPI } from "^/services/item";
import { IItemFieldRequest, IItemForm } from "^/@types/models/item";
import { initialItemForm } from "^/config/item/config";
import useAppDispatch from "../useAppDispatch";
import { actions as toastActs } from "@/redux/toast";
import { useTranslations } from "next-intl";

const useGetItemById = () => {
  const t = useTranslations("");

  const router = useRouter();
  const { id } = router.query;

  const dispatch = useAppDispatch();

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState<any>(null);
  const [formVal, setFormVal] = useState<IItemForm>(initialItemForm);

  const fetch = useCallback(
    async (
      payload: Omit<IItemFieldRequest["query"], "name"> = {
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
          const response = await getItemAPI(session, payload);

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
            setItemData(response.data.data.items[0]);
            setFormVal(response.data.data.items[0]);

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

  return { itemData, formVal, loading, fetch };
};

export default useGetItemById;
