import { CustomTblBody } from "@/components/CustomTable/types";
import { Button } from "@/components/ui/button";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useAppSelector from "../useAppSelector";
import { deleteBranchAPI } from "^/services/branch";
import { IBranchFieldRequest } from "^/@types/models/branch";
import { ROLE_PAGE } from "@/constants/pageURL";
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
  initPgPrms,
} from "@/components/PaginationCustom/config";
import { formatDate } from "^/utils/dateFormatting";
import { IRoleFieldRequest } from "^/@types/models/role";
import { getRoleAPI } from "^/services/role";
import { Options } from "^/@types/global";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { pageRowsArr } from "^/config/request/config";
import useCloseAlertModal from "../useCloseAlertModal";

const useGetRole = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const router = useRouter();

  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<any>(null);
  const [tblBd, setTblBd] = useState<CustomTblBody[]>([]);
  const [roleOpts, setRoleOpts] = useState<Options[]>([]);
  const [rolePgntn, setRoleTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);

  const fetch = useCallback(
    async (
      payload: Omit<IRoleFieldRequest["query"], "name"> = {
        page: 1,
        limit: pageRowsArr[2],
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      try {
        const response = await getRoleAPI(session, payload);

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
          setRoles(resData);
          setRoleTblPgntn({
            page: resData.data.page,
            limit: resData.data.limit,
            nextPage: resData.data.nextPage,
            prevPage: resData.data.prevPage,
            totalPages: resData.data.totalPages,
          });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        return null;
      }
    },
    [dispatch, session, t]
  );

  const confirmDelOk = useCallback(
    async (id: string) => {
      setLoading(true);
      const resDelete = await deleteBranchAPI(session, id);
      if (resDelete.data.success) {
        await fetch();
        await dispatch(
          toastActs.callShowToast({
            ...toast,
            show: false,
          })
        );
        await dispatch(
          toastActs.callShowToast({
            show: true,
            msg: (
              <div className="flex flex-col py-[1rem]">
                <span> {capitalizeStr(t("API_MSG.SUCCESS.ROLE_DELETE"))} </span>
              </div>
            ),
            type: "success",
          })
        );
      } else {
        await dispatch(
          toastActs.callShowToast({
            ...toast,
            show: true,
            msg: (
              <div className="flex flex-col py-[1rem] capitalize">
                <span>{t(capitalizeStr(t("API_MSG.ERROR.ROLE_DELETE")))}</span>
              </div>
            ),
            timeout: 2000,
            type: "error",
          })
        );
      }
      setLoading(false);
    },
    [dispatch, fetch, session, t, toast]
  );

  const confirmDeletion = useCallback(
    async (id: string) => {
      await dispatch(
        toastActs.callShowToast({
          show: true,
          msg: (
            <div className="flex flex-col pt-[1rem] capitalize">
              <h1 className="text-[1.5rem]">
                {t(capitalizeStr(t("Msg.areUSure")))}
              </h1>
              <div className="mt-[1rem] flex flex-row justify-center gap-4 text-white">
                <Button onClick={() => confirmDelOk(id)} variant="destructive">
                  {capitalizeStr(t("Common.delete"))}
                </Button>
                <Button onClick={closeAlertModal} type="reset">
                  {capitalizeStr(t("Common.cancel"))}
                </Button>
              </div>
            </div>
          ),
          type: "confirm",
        })
      );
    },
    [closeAlertModal, confirmDelOk, dispatch, t]
  );

  const onPaginationChange = useCallback(
    (prm: PaginationCustomPrms) => {
      const pgntParam: Omit<IBranchFieldRequest["query"], "name"> = {
        page: prm.page,
        limit: prm.limit,
        "sort[key]": "name",
        "sort[direction]": "asc",
      };

      fetch(pgntParam);
    },
    [fetch]
  );

  const handleNextClck = () => {
    const newPrms = handlePrmChangeNextBtn(rolePgntn);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const newPrms = handlePrmChangePrevBtn(rolePgntn);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const newPrms = handlePrmChangeInputPage(rolePgntn, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const newPrms = handlePrmChangeRowPage(rolePgntn, prm);
    onPaginationChange(newPrms);
  };

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  useEffect(() => {
    let formattedBody: CustomTblBody[] = [];
    if (roles && Array.isArray(roles.data.items)) {
      formattedBody = roles.data.items.map((x: any) => {
        return {
          items: [
            {
              value: x.name,
              className: "text-left w-[15rem]",
            },
            {
              value: x.email,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.phone,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: formatDate(x.birthDate),
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.enabled ? "active" : "inactive",
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: (
                <CustomTableOptionMenu
                  rowId={x.id}
                  editURL={`${ROLE_PAGE.EDIT}/${x.id}`}
                  viewURL={`${ROLE_PAGE.VIEW}/${x.id}`}
                  confirmDel={confirmDeletion}
                />
              ),
              className: "",
            },
          ],
        };
      });
    }
    setTblBd(formattedBody);
  }, [confirmDeletion, router, t, roles]);

  useEffect(() => {
    if (roles) {
      const items = roles.data.items;
      // build opts
      const opts =
        roles && Array.isArray(items) && items.length > 0
          ? items.map((x: any) => {
              return {
                value: x.id,
                text: x.displayName,
              };
            })
          : [];
      setRoleOpts(opts);
    }
  }, [roles]);

  return {
    loading,
    fetch,
    roles,
    roleOpts,
    tblBd,
    rolePgntn,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  };
};

export default useGetRole;
