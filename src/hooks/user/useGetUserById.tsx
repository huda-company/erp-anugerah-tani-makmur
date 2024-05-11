import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { getUserAPI } from "^/services/user";
import { IUserFieldRequest, IUserForm } from "^/@types/models/user";
import { initialUserForm } from "^/config/user/config";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";
import { actions as toastActs } from "@/redux/toast";

const useGetUserById = () => {
  const t = useTranslations("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const fetched = useRef(false);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [formVal, setFormVal] = useState<IUserForm>(initialUserForm);

  const fetch = useCallback(
    async (
      payload: Omit<IUserFieldRequest["query"], "name"> = {
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
          const response = await getUserAPI(session, payload);

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
            const userData = response.data.data.items[0];
            setUser(userData);
            setFormVal({
              ...userData,
              role: userData.roles[0].id,
            });

            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          return null;
        }
      }

      setLoading(false);
    },
    [id, session]
  );

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  return { user, formVal, loading, fetch };
};

export default useGetUserById;
