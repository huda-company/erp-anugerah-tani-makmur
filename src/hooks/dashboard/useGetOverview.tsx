import { pageRowsArr } from "^/config/supplier/config";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import { actions as toastActs } from "@/redux/toast";
import { IBranchFieldRequest } from "^/@types/models/branch";

import { getOverviewAPI } from "^/services/dashboard";

const useGetOverview = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);

  const fetch = useCallback(
    async (
      payload: Omit<IBranchFieldRequest["query"], "name"> = {
        page: 1,
        limit: pageRowsArr[2],
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      try {
        const response = await getOverviewAPI(session, payload);

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
          const { data: resData } = response;
          setOverview(resData.data);

          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        return null;
      }
    },
    [dispatch, session, t]
  );

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  return {
    loading,
    fetch,
    overview,
  };
};

export default useGetOverview;
