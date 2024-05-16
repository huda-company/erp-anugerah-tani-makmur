import { FC, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import { Badge } from "../ui/badge";
import { capitalizeStr } from "^/utils/capitalizeStr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { VscSettings } from "react-icons/vsc";
import { useRouter } from "next/router";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { thsandSep } from "^/utils/helpers";
import { formatDate } from "^/utils/dateFormatting";
import CustomTable from "../CustomTable/CustomTable";
import { useTranslations } from "next-intl";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { getStaticProps } from "^/utils/getStaticProps";
import clsxm from "^/utils/clsxm";
import { CustomTblData } from "../CustomTable/types";
import Loading from "../Loading";
import EmptyContent from "../EmptyContent/EmptyContent";
import useGetPaymentPurchByPurchId from "@/hooks/purchase/useGetPaymentPurchByPurchId";

const PurchDetailSect: FC = () => {
  const t = useTranslations("");

  const router = useRouter();
  const { id } = router.query;

  const { purch, tblBd, purchLoading } = useGetPurchaseById();
  const { paymPurchTotal } = useGetPaymentPurchByPurchId();

  const header = useMemo(
    () => [
      {
        value: capitalizeStr(t("Sidebar.item")),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: capitalizeStr(t("PurchasePage.price")),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: capitalizeStr(t("PurchasePage.quantity")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("Sidebar.unit")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("PurchasePage.discount")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("PurchasePage.total")),
        className: "text-left text-xs w-[9rem] p-0",
      },
    ],
    [t]
  );

  const tblData: CustomTblData = useMemo(
    () => ({
      header: header,
      body: tblBd,
    }),
    [header, tblBd]
  );

  return (
    <>
      {purchLoading && <Loading />}

      {!purchLoading && purch ? (
        <Card className="">
          <CardHeader className="bg-[#EAE2E1] p-2">
            <CardTitle>
              <div className="flex justify-between">
                <div className="flex items-center justify-center gap-x-5">
                  <span>PO : {purch.poNo}</span>

                  <Badge
                    variant="destructive"
                    className={clsxm(
                      "text-sm text-white ",
                      purch.status == "draft" && "bg-green-400"
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
                          router.push(`${PURCHASE_PAGE.VIEW}/${String(id)}`)
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
                  {thsandSep(Number(purch.grandTotal) - Number(paymPurchTotal))}
                </span>
              </div>
            </div>
            <div className="mt-[1rem] rounded-[1rem] bg-[#E2E7E8]">
              <CustomTable data={tblData} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyContent />
      )}
    </>
  );
};

export { getStaticPaths, getStaticProps };

export default PurchDetailSect;
