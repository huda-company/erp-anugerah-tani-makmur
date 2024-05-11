import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { initialBranchForm } from "^/config/branch/config";
import { IBranchFieldRequest, IBranchForm } from "^/@types/models/branch";
import { getBranchAPI } from "^/services/branch";
import useAppDispatch from "../useAppDispatch";
import { useTranslations } from "next-intl";
import { actions as toastActs } from "@/redux/toast";

const useGetPurchaseByUser = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any>(null);
  const [formVal, setFormVal] = useState<IBranchForm>(initialBranchForm);

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
          const response = await getBranchAPI(session, payload);

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
            setBranches(response.data.data.items[0]);
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

  return { branches, formVal, loading, fetch };
};

export default useGetPurchaseByUser;
