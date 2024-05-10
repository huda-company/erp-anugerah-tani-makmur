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
import { ITEM_PAGE } from "@/constants/pageURL";
import { useTranslations } from "next-intl";
import useAppDispatch from "../useAppDispatch";

import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";
import useAppSelector from "../useAppSelector";
import { IItemFieldRequest } from "^/@types/models/item";
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

const useGetItem = () => {
  const t = useTranslations("");

  const fetched = useRef(false);

  const dispatch = useAppDispatch();

  const toast = useAppSelector(toastSelectors.toast);

  const router = useRouter();

  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState<any>(null);
  const [tblBd, setTblBd] = useState<CustomTblBody[]>([]);
  const [itemDataOpts, setItemDataOpts] = useState<Options[]>([]);
  const [itemPgntn, setItemTblPgntn] =
    useState<PaginationCustomPrms>(initPgPrms);

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
          return null;
        }

        if (response.data) {
          const { data: resData } = response;

          setItemData(resData);
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
    [session]
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
      const items = itemData.data.items;
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
    let formattedBody: CustomTblBody[] = [];
    if (itemData && Array.isArray(itemData.data.items)) {
      formattedBody = itemData.data.items.map((x: any) => {
        return {
          items: [
            {
              value:
                x && x.itemCategory && typeof x.itemCategory.name == "string"
                  ? x.itemCategory.name
                  : "wrong value format",
              className: "text-left w-[15rem]",
            },
            {
              value: x.name,
              className: "text-left w-[15rem]",
            },
            {
              value: x.description,
              className: "text-left w-[6rem] pl-0",
            },
            {
              value: x.price,
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
                      onClick={() => router.push(`${ITEM_PAGE.EDIT}/${x.id}`)}
                    >
                      {capitalizeStr(t("Common.edit"))}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`${ITEM_PAGE.VIEW}/${String(x.id)}`)
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
  }, [confirmDeletion, itemData, router, t]);

  return {
    loading,
    fetch,
    itemData,
    tblBd,
    itemDataOpts,
    itemPgntn,
    handleNextClck,
    handlePrevClck,
    handlePageRowChange,
    handlePageInputChange,
  };
};

export default useGetItem;
