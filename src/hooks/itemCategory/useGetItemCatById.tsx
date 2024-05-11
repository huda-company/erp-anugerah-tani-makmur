import { useCallback, useEffect, useRef, useState } from "react";
import { actions as toastActs } from "@/redux/toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  IItemCatFieldRequest,
  IItemCatForm,
} from "^/@types/models/itemcategory";
import { getItemCatAPI } from "^/services/itemCategory";
import { initialItemCatForm } from "^/config/itemcategory/config";
import useAppDispatch from "../useAppDispatch";
import { useTranslations } from "next-intl";

const useGetItemCatById = () => {
  const t = useTranslations("");

  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<any>(null);
  const [formVal, setFormVal] = useState<IItemCatForm>(initialItemCatForm);

  const fetch = useCallback(
    async (
      payload: Omit<IItemCatFieldRequest["query"], "name"> = {
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
          const response = await getItemCatAPI(session, payload);

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
            setSupplier(response.data.data.items[0]);
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

  return { supplier, formVal, loading, fetch };
};

export default useGetItemCatById;
