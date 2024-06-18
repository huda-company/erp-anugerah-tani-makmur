import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { bcData } from "^/config/purchase/config";
import Loading from "@/components/Loading";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import PurchDetailSect from "@/components/Purchase/PurchDetailSect";
import PurchPaymSect from "@/components/Purchase/PurchPaymSect";
import PurchFileSect from "@/components/Purchase/PurchFileSect";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { VscSettings } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import clsxm from "^/utils/clsxm";
import { PurchaseStatus } from "^/@types/models/purchase";
import useAppDispatch from "@/hooks/useAppDispatch";
import { actions as toastActs } from "@/redux/toast";
import { apprPurchaseAPI } from "^/services/purchase";
import { thsandSep } from "^/utils/helpers";
import { formatDate } from "^/utils/dateFormatting";
import useGetPaymentPurchByPurchId from "@/hooks/purchase/useGetPaymentPurchByPurchId";

const ViewPurchasePage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.detail")} ${t("Sidebar.purchaseOrder")}`;

  const dispatch = useAppDispatch();

  const { purch, purchLoading } = useGetPurchaseById();
  const { paymPurchTotal } = useGetPaymentPurchByPurchId();

  const router = useRouter();
  const { id } = router.query;

  const { status, data: session } = useSession();

  const doApprPO = async () => {
    try {
      const res = await apprPurchaseAPI(session, String(id));
      if (res?.statusText == "OK") {
        dispatch(
          toastActs.callShowToast({
            show: true,
            msg: (
              <div className="flex flex-col py-[1rem]">
                <span>{t("API_MSG.SUCCESS.PURCHASE_APPROVED")}</span>
              </div>
            ),
            type: "success",
            timeout: 300,
          })
        );

        location.reload();
      }
    } catch (error) {
      dispatch(
        toastActs.callShowToast({
          show: true,
          msg: error ? (
            <div className="flex flex-col py-[1rem]">
              <span>{String(error)}</span>
            </div>
          ) : (
            <div className="flex flex-col py-[1rem]">
              <span>{t("API_MSG.ERROR.UNEXPECTED_ERROR")}</span>
            </div>
          ),
          type: "error",
        })
      );
    }
  };

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={PURCHASE_PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          {(status == "loading" || purchLoading) && <Loading />}

          {status == "authenticated" && !purchLoading && purch ? (
            <>
              <div className="flex flex-col gap-y-2 rounded-[1rem] border-2 border-primary p-4">
                <CardHeader className="bg-[#EAE2E1] p-2">
                  <CardTitle>
                    <div className="flex justify-between">
                      <div className="flex items-center justify-center gap-x-5">
                        <span>PO : {purch.poNo}</span>

                        <Badge
                          variant="destructive"
                          className={clsxm(
                            "text-sm text-white ",
                            purch.status == PurchaseStatus.DRAFT &&
                              "bg-green-400"
                          )}
                        >
                          {capitalizeStr(purch.status)}
                        </Badge>
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="bg-black hover:bg-black"
                            asChild
                          >
                            <Button
                              variant="ghost"
                              className="hover:none h-6 w-6 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <VscSettings className="h-4 w-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`${PURCHASE_PAGE.EDIT}/${id}`)
                              }
                            >
                              {capitalizeStr(t("Common.edit"))}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `${PURCHASE_PAGE.VIEW}/${String(id)}`
                                )
                              }
                            >
                              {capitalizeStr(t("Common.view"))}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <a
                                href={`${PURCHASE_PAGE.PDF}/${String(id)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Generate Pdf
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={doApprPO}>
                              Approve PO
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="mt-[1rem] flex flex-col gap-y-1">
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">supplier</span>{" "}
                      <span>{purch.supplier.company}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.paymentMethod")}
                      </span>{" "}
                      <span>{purch.purchPaymentMethod}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.billCode")}
                      </span>{" "}
                      <span>{purch.billingCode}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.soNo")}
                      </span>{" "}
                      <span>{purch.soNumber}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.date")}
                      </span>{" "}
                      <span>{formatDate(purch.date)}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.expDate")}
                      </span>{" "}
                      <span>{formatDate(purch.expDate)}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.grandTotal")}
                      </span>{" "}
                      <span>Rp {thsandSep(Number(purch.grandTotal))}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.purcPaymTotal")}
                      </span>{" "}
                      <span>Rp {thsandSep(Number(paymPurchTotal))}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.purcPaymDiff")}
                      </span>{" "}
                      <span>
                        Rp{" "}
                        {thsandSep(
                          Number(purch.grandTotal) - Number(paymPurchTotal)
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <Tabs defaultValue="detail" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="detail">Item Detail</TabsTrigger>
                    <TabsTrigger value="payment">
                      {capitalizeStr(t("PurchasePage.purcPaymHistory"))}
                    </TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                  </TabsList>
                  <TabsContent value="detail">
                    <PurchDetailSect />
                  </TabsContent>
                  <TabsContent value="payment">
                    <PurchPaymSect />
                  </TabsContent>
                  <TabsContent value="files">
                    <PurchFileSect />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <EmptyContent />
          )}
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticPaths, getStaticProps };

export default ViewPurchasePage;
