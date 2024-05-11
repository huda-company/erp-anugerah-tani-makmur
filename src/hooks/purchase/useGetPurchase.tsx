import { CustomTblBody } from "@/components/CustomTable/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pageRowsArr } from "^/config/supplier/config";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
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
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { getPurchaseAPI } from "^/services/purchase";
import { formatDate } from "^/utils/dateFormatting";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
  initPgPrms,
} from "@/components/PaginationCustom/config";
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import { IPurchaseFieldRequest } from "^/@types/models/purchase";

const useGetPurchase = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const router = useRouter();

  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [purchData, setPurchData] = useState<any>(null);
  const [tblBd, setTblBd] = useState<CustomTblBody[]>([]);
  const [purchPgntn, setPurchTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);

  const fetch = useCallback(
    async (
      payload: Omit<IBranchFieldRequest["query"], "name"> = {
        page: 1,
        limit: pageRowsArr[0],
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

      try {
        const response = await getPurchaseAPI(session, payload);

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
          setPurchData(resData);
          setPurchTblPgntn({
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
                <span>
                  {" "}
                  {capitalizeStr(t("API_MSG.SUCCESS.BRANCH_DELETE"))}{" "}
                </span>
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
                <span>
                  {t(capitalizeStr(t("API_MSG.ERROR.BRANCH_DELETE")))}
                </span>
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

  const closeAlertModal = useCallback(async () => {
    await dispatch(
      toastActs.callShowToast({
        ...toast,
        show: false,
      })
    );
  }, [dispatch, toast]);

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
                <Button
                  onClick={() => confirmDelOk(id)}
                  className="bg-destructive text-white"
                >
                  {capitalizeStr(t("Common.delete"))}
                </Button>
                <Button
                  className="text-white"
                  onClick={closeAlertModal}
                  type="reset"
                >
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
      const pgntParam: Omit<IPurchaseFieldRequest["query"], "name"> = {
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
    const newPrms = handlePrmChangeNextBtn(purchPgntn);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const newPrms = handlePrmChangePrevBtn(purchPgntn);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const newPrms = handlePrmChangeInputPage(purchPgntn, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const newPrms = handlePrmChangeRowPage(purchPgntn, prm);
    onPaginationChange(newPrms);
  };

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  useEffect(() => {
    let formattedBody: CustomTblBody[] = [];
    if (purchData && Array.isArray(purchData.data.items)) {
      formattedBody = purchData.data.items.map((x: any) => {
        return {
          items: [
            {
              value: x.poNo,
              className: "text-left w-[15rem]",
            },
            {
              value:
                x.supplier && x.supplier.company
                  ? x.supplier.company
                  : x.supplier,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: formatDate(x.expDate),
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.year,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.status,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: (
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-gray-300" asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`${PURCHASE_PAGE.EDIT}/${x.id}`)
                      }
                    >
                      {capitalizeStr(t("Common.edit"))}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`${PURCHASE_PAGE.VIEW}/${String(x.id)}`)
                      }
                    >
                      {capitalizeStr(t("Common.view"))}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => confirmDeletion(x.id)}>
                      {capitalizeStr(t("Common.delete"))}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
              className: "",
            },
          ],
        };
      });
    }
    setTblBd(formattedBody);
  }, [purchData, confirmDeletion, router, t]);

  return {
    loading,
    fetch,
    purchData,
    purchPgntn,
    tblBd,
    handleNextClck,
    handlePrevClck,
    handlePageInputChange,
    handlePageRowChange,
    onPaginationChange,
  };
};

export default useGetPurchase;
