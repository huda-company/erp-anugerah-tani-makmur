import DashboardLayout from "@/components/DashboardLayout";
import HeaderModule from "@/components/DashboardLayout/HeaderModule";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC, FormEvent, useMemo, useState } from "react";
import { getStaticProps } from "^/utils/getStaticProps";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { useTranslations } from "next-intl";
import { PURCHASE_PAGE } from "@/constants/pageURL";
import { bcData } from "^/config/purchase/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomTable from "@/components/CustomTable/CustomTable";
import { CustomTblData } from "@/components/CustomTable/types";
import Loading from "@/components/Loading";
import moment from "moment";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import { MdDriveFolderUpload } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Input } from "@/components/ui/input";
import { createBilldocAPI } from "^/services/billdoc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useAppDispatch from "@/hooks/useAppDispatch";
import { actions as toastActs } from "@/redux/toast";
import { BASE_URL } from "^/config/env";
import { billDocURL } from "@/constants/uploadDir";
import { FaRegEye } from "react-icons/fa";
import { formatDate } from "^/utils/dateFormatting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { VscSettings } from "react-icons/vsc";
import EmptyContent from "@/components/EmptyContent/EmptyContent";
import { thsandSep } from "^/utils/helpers";
import PaymentPurchaseForm from "@/components/PaymentPurchase/PaymentPurchaseForm";
import clsxm from "^/utils/clsxm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomToolTip from "@/components/CustomTooltip";

const ViewPurchasePage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const t = useTranslations("");
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const titlePage = `${t("Common.detail")} ${t("Sidebar.purchaseOrder")}`;

  const {
    purchase,
    paymPurcTblBd,
    paymPurchTotal,
    billdocs,
    tblBd,
    loading,
    fetch,
    fetchPaymPurch,
  } = useGetPurchaseById();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("invoice");
  const [description, setDescription] = useState<string>("");
  const [showPaymPurchForm, setShowPaymPurchForm] = useState<boolean>(false);

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

  const payPurchHeader = useMemo(
    () => [
      {
        value: capitalizeStr(t("PurchasePage.paymentDate")),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: capitalizeStr(t("PurchasePage.nominal")),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: capitalizeStr(t("PurchasePage.paymentMethod")),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: capitalizeStr(t("Common.action")),
        className: "sticky right-0 z-20 text-left text-xs w-[3rem]",
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

  const paymPurchTData: CustomTblData = useMemo(
    () => ({
      header: payPurchHeader,
      body: paymPurcTblBd,
    }),
    [payPurchHeader, paymPurcTblBd]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      setFile(fileList[0]);
    }
  };

  const handleSubmitUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (file) {
      const res = await createBilldocAPI(session, {
        id: String(id),
        file,
        title,
        description,
      });

      if (res && res.data && res.status == 200) {
        dispatch(
          toastActs.callShowToast({
            show: true,
            msg: (
              <div className="flex flex-col py-[1rem]">
                <span>{t("API_MSG.SUCCESS.UPLOAD_FILE")}</span>
              </div>
            ),
            type: "success",
            timeout: 2000,
          })
        );
        await fetch();
      } else {
        dispatch(
          toastActs.callShowToast({
            show: true,
            msg: (
              <div className="flex flex-col py-[1rem]">
                <span>{t("API_MSG.ERROR.UPLOAD_FILE")}</span>
              </div>
            ),
            type: "success",
            timeout: 2000,
          })
        );
      }
    }
  };

  const handlePaymPurchFormClose = async () => {
    setShowPaymPurchForm(false);
    await fetchPaymPurch();
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

          {loading && <Loading />}

          {!loading && purchase ? (
            <div className="flex flex-col gap-y-2 rounded-[1rem] border-2 border-primary p-4">
              <Card className="">
                <CardHeader className="bg-[#EAE2E1] p-2">
                  <CardTitle>
                    <div className="flex justify-between">
                      <span>PO : {purchase.poNo}</span>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-[1rem] flex flex-col">
                    <div className="flex flex-row capitalize">
                      <span className="w-[40%] capitalize">status</span>{" "}
                      <Badge
                        variant="destructive"
                        className={clsxm(
                          "text-md text-white ",
                          purchase.status == "draft" && "bg-green-400"
                        )}
                      >
                        {capitalizeStr(purchase.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">supplier</span>{" "}
                      <span>{purchase.supplier.company}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.paymentMethod")}
                      </span>{" "}
                      <span>{purchase.purchPaymentMethod}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.billCode")}
                      </span>{" "}
                      <span>{purchase.billingCode}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.soNo")}
                      </span>{" "}
                      <span>{purchase.soNumber}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.date")}
                      </span>{" "}
                      <span>{formatDate(purchase.date)}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.expDate")}
                      </span>{" "}
                      <span>{formatDate(purchase.expDate)}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[40%] capitalize">
                        {t("PurchasePage.grandTotal")}
                      </span>{" "}
                      <span>Rp {thsandSep(Number(purchase.grandTotal))}</span>
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
                          Number(purchase.grandTotal) - Number(paymPurchTotal)
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-[1rem] rounded-[1rem] bg-[#E2E7E8]">
                    <CustomTable data={tblData} />
                  </div>
                </CardContent>
              </Card>

              <div className="mt-[0.5rem] flex gap-x-4">
                <Card className="w-1/2 ">
                  <CardHeader className="bg-[#EAE2E1] p-2">
                    <CardTitle>
                      <div className="flex justify-between">
                        <span>
                          {capitalizeStr(t("PurchasePage.purcPaymHistory"))}
                        </span>
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
                                onClick={() => {
                                  setShowPaymPurchForm(true);
                                }}
                              >
                                {`${capitalizeStr(t("Common.add"))} ${capitalizeStr(t("PurchasePage.purcPaymHistory"))} `}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showPaymPurchForm && (
                      <div className="mt-[0.5rem] flex w-fit flex-row gap-x-4 rounded-[0.5rem] bg-[#E0EDF0] p-1">
                        <PaymentPurchaseForm
                          onclose={() => handlePaymPurchFormClose()}
                          onSubmitOk={() => handlePaymPurchFormClose()}
                        />
                      </div>
                    )}
                    <div className="mt-[1rem] rounded-[1rem] bg-[#E2E7E8]">
                      <CustomTable key="paymPurchTbl" data={paymPurchTData} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="w-1/2 ">
                  <CardHeader className="bg-[#EAE2E1] p-2">
                    <CardTitle>Files</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <form onSubmit={handleSubmitUpload}>
                      <div className="flex flex-col gap-y-2 rounded-[0.4rem] bg-[#E0EDF0] p-2 py-[0.5rem]">
                        <div className=" flex flex-row gap-x-2">
                          <div className="flex flex-row gap-x-2">
                            <Select
                              onValueChange={(e: any) => {
                                setTitle(e.target.value);
                              }}
                              defaultValue={"invoice"}
                              name="title"
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={capitalizeStr(
                                    t("PurchasePage.paymentMethod")
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem key="invoice" value="invoice">
                                  Invoice
                                </SelectItem>
                                <SelectItem key="billcode" value="billcode">
                                  Billing code
                                </SelectItem>
                                <SelectItem key="other" value="other">
                                  other
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Input type="file" onChange={handleFileChange} />
                          </div>
                        </div>

                        <Input
                          type="text"
                          name="description"
                          placeholder="Description"
                          onChange={(e: any) => {
                            setDescription(e.target.value);
                          }}
                        />

                        <div className="">
                          <CustomToolTip
                            elm={
                              <button
                                type="submit"
                                className="flex items-center rounded-[0.5rem] bg-[#5FBEDB] p-1"
                              >
                                <MdDriveFolderUpload className="h-6 w-16" />
                              </button>
                            }
                            content={<p>{capitalizeStr(t("Common.submit"))}</p>}
                          />
                        </div>
                      </div>
                    </form>

                    <div className="mt-[1rem] rounded-[1rem] bg-[#E0EDF0] p-2">
                      {billdocs &&
                      Array.isArray(billdocs) &&
                      billdocs.length > 0
                        ? billdocs.map((x: any, idx: number) => {
                            const billDocUrl = `${BASE_URL}${billDocURL}`;
                            return (
                              <ol key="file-list">
                                <li
                                  key={idx}
                                  className="flex items-center justify-between"
                                >
                                  {`${x.title}`}
                                  <span className="text-sm">{`${moment(x.createdAt).format("DD/MM/YY")} `}</span>
                                  <a
                                    href={`${billDocUrl}/${x.fileName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaRegEye />
                                  </a>
                                </li>
                              </ol>
                            );
                          })
                        : `-- ${capitalizeStr(t("PurchasePage.noFileFound"))} --`}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
