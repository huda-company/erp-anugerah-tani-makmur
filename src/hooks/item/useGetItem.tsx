import { Button } from "@/components/ui/button";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useAppSelector from "../useAppSelector";
import {
  IItemFieldRequest,
  IItemGetReq,
  ItemResp,
  ItemTanTblData,
} from "^/@types/models/item";
import { deleteItemAPI, getItemAPI } from "^/services/item";
import { Options } from "^/@types/global";
import { PaginationCustomPrms } from "@/components/PaginationCustom/types";
import {
  handlePrmChangeInputPage,
  handlePrmChangeNextBtn,
  handlePrmChangePrevBtn,
  handlePrmChangeRowPage,
  initPgPrms,
} from "@/components/PaginationCustom/config";
import { pageRowsArr } from "^/config/request/config";
import useCloseAlertModal from "../useCloseAlertModal";
import { initItemReqPrm } from "^/config/item/config";

const useGetItem = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const { closeAlertModal } = useCloseAlertModal();

  const { data: session } = useSession();

  const [reqPrm, setReqPrm] = useState<IItemGetReq>({
    ...initItemReqPrm,
    page: 0,
    limit: pageRowsArr[4],
  });
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState<any>(null);
  const [itemDataOpts, setItemDataOpts] = useState<Options[]>([]);
  const [itemPgntn, setItemTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);
  const [data, setData] = useState<ItemTanTblData[]>([]);

  const fetch = useCallback(
    async (
      payload: Omit<IItemFieldRequest["query"], "name"> = {
        page: 1,
        limit: pageRowsArr[0],
        "sort[key]": "name",
        "sort[direction]": "asc",
      }
    ) => {
      fetched.current = true;
      setLoading(true);

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
          const { data: resData } = response;

          setItemData(resData.data.items);
          setItemTblPgntn({
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
      const resDelete = await deleteItemAPI(session, id);
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
                <span> {capitalizeStr(t("API_MSG.SUCCESS.ITEM_DELETE"))} </span>
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
                <span>{t(capitalizeStr(t("API_MSG.ERROR.ITEM_DELETE")))}</span>
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
      const pgntParam: Omit<IItemFieldRequest["query"], "name"> = {
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
    const newPrms = handlePrmChangeNextBtn(itemPgntn);
    onPaginationChange(newPrms);
  };

  const handlePrevClck = () => {
    const newPrms = handlePrmChangePrevBtn(itemPgntn);
    onPaginationChange(newPrms);
  };

  const handlePageInputChange = (prm: number) => {
    const newPrms = handlePrmChangeInputPage(itemPgntn, prm);
    onPaginationChange(newPrms);
  };

  const handlePageRowChange = (prm: number) => {
    const newPrms = handlePrmChangeRowPage(itemPgntn, prm);
    onPaginationChange(newPrms);
  };

  useEffect(() => {
    if (!fetched.current && session && session?.accessToken) fetch();
  }, [fetch, session]);

  useEffect(() => {
    if (itemData) {
      const items = itemData;
      // build opts
      const opts =
        itemData && Array.isArray(items) && items.length > 0
          ? items.map((x: any) => {
              return {
                value: x.id,
                text: x.name,
              };
            })
          : [];
      setItemDataOpts(opts);
    }
  }, [itemData]);

  useEffect(() => {
    if (itemData) {
      const tStackTblBd = itemData.map((x: ItemResp) => {
        return {
          id: String(x.id),
          name: x.name,
          brand: x.brand,
          packaging: x.packaging,
          itemCategoryName: x && x.itemCategory.name,
          description: x.description,
          enabled: x.enabled,
          removed: x.removed,
          removedBy: x.removedBy,
        } as ItemTanTblData;
      });
      setData(tStackTblBd);
    }
  }, [itemData]);

  return {
    loading,
    fetch,
    itemData,
    itemDataOpts,
    itemPgntn,
    data,
    reqPrm,
    setReqPrm,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
    confirmDeletion,
  };
};

export default useGetItem;
