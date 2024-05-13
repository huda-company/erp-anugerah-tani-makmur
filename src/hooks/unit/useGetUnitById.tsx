import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { initialBranchForm } from "^/config/branch/config";
import { IBranchFieldRequest, IBranchForm } from "^/@types/models/branch";
import useAppDispatch from "../useAppDispatch";
import { actions as toastActs } from "@/redux/toast";
import { useTranslations } from "next-intl";
import { getUnitAPI } from "^/services/unit";

const useGetUnitById = () => {
  const t = useTranslations("");

  const router = useRouter();
  const { id } = router.query;

  const dispatch = useAppDispatch();

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<any>(null);
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
          const response = await getUnitAPI(session, payload);

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
            setUnit(response.data.data.items[0]);
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

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  return { unit, formVal, loading, fetch };
};

export default useGetUnitById;
