import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bcData } from "^/config/supplier/config";
import { FC } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { DELIV_NOTE_PAGE } from "@/constants/pageURL";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import useGetDelivNoteById from "@/hooks/delivery-note/useGetDelivNoteById";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VscSettings } from "react-icons/vsc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { noop } from "lodash";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { thsandSep } from "^/utils/helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DelivNoteDetailSect from "@/components/DeliveryNote/DelivNoteDetailSect";
import DelivNotePaymentSect from "@/components/DeliveryNote/DelivNotePaymentSect";
import useGetDelivNotePaymByDnoteId from "@/hooks/delivery-note/useGetDelivNotePaymByDnoteId";

const ViewDelivNotePage: FC = () => {
  const t = useTranslations("");
  const titlePage = `${t("Common.detail")} ${t("Sidebar.delivNote")}`;

  const router = useRouter();
  const { id } = router.query;

  const { status, data: session } = useSession();

  const { delivNote, delivNoteLoading: loading } = useGetDelivNoteById(session);
  const { paymPurchTotal } = useGetDelivNotePaymByDnoteId(session);

  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 md:p-8">
          <HeaderModule
            addPageURL={DELIV_NOTE_PAGE.PAGE.ADD}
            title={titlePage}
            bcumbs={bcData}
          />

          {(status == "loading" || loading) && <Loading />}

          {status == "authenticated" && !loading && delivNote ? (
            <>
              <div className="flex flex-col gap-y-2 rounded-[1rem] border-2 border-primary p-4">
                <CardHeader className="bg-[#EAE2E1] p-2">
                  <CardTitle>
                    <div className="flex justify-between">
                      <div className="flex items-center justify-center gap-x-5">
                        <span>Nomor NP : {delivNote?.code || "-"}</span>
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
                                router.push(
                                  `${DELIV_NOTE_PAGE.PAGE.EDIT}/${id}`
                                )
                              }
                            >
                              {capitalizeStr(t("Common.edit"))}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `${DELIV_NOTE_PAGE.PAGE.VIEW}/${String(id)}`
                                )
                              }
                            >
                              {capitalizeStr(t("Common.view"))}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <a
                                href={`${DELIV_NOTE_PAGE.PAGE.PDF}/${String(id)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Generate Pdf
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={noop}>
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
                      <span className="w-[40%] capitalize">
                        {t("Sidebar.branch")}
                      </span>{" "}
                      <span>{delivNote.branch.name || "-"}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.driverName")}
                      </span>{" "}
                      <span>{delivNote.driverName || "-"}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.driverLicenseNo")}
                      </span>{" "}
                      <span>{delivNote.driverLicenseNo || "-"}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.vehicleType")}
                      </span>{" "}
                      <span>{delivNote.vehicleType || "-"}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.flatNo")}
                      </span>{" "}
                      <span>{delivNote.flatNo || "-"}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {`${t("PurchasePage.price")} ${t("Sidebar.selling")}`}
                      </span>{" "}
                      <span>
                        Rp {thsandSep(Number(delivNote.sellingTotal || "0"))}
                      </span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {`${t("PurchasePage.price")} ${t("Sidebar.purchase")}`}
                      </span>{" "}
                      <span>
                        Rp {thsandSep(Number(delivNote.purchaseTotal || "0"))}
                      </span>
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
                          Number(delivNote.purchaseTotal) -
                            Number(paymPurchTotal)
                        )}
                      </span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.note")}
                      </span>{" "}
                      <span>{delivNote.note || "-"}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("Index.description")}
                      </span>{" "}
                      <span>{delivNote.description || "-"}</span>
                    </div>
                  </div>
                </CardContent>

                <Tabs defaultValue="detail" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="detail">Item Detail</TabsTrigger>
                    <TabsTrigger value="payment">
                      {capitalizeStr(t("PurchasePage.purcPaymHistory"))}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="detail">
                    <DelivNoteDetailSect />
                  </TabsContent>
                  <TabsContent value="payment">
                    <DelivNotePaymentSect />
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

export default ViewDelivNotePage;
