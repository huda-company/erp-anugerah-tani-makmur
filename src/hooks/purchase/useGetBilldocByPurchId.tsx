import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { IBillDocFieldRequest } from "^/@types/models/billdoc";
import { getBilldocAPI } from "^/services/billdoc";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";
import { actions as toastActs } from "@/redux/toast";

const useGetBilldocByPurchId = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [billdocs, setBillDocs] = useState<any>(null);

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

  useEffect(() => {
    if (!fetched.current && id && session && session?.accessToken) {
      fetchBilldoc();

      fetched.current = true;
    }
  }, [fetchBilldoc, id, session]);

  return {
    billdocs,
    loading,
    fetch,
  };
};

export default useGetBilldocByPurchId;
