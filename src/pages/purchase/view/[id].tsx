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
import { DotsVerticalIcon } from "@radix-ui/react-icons";

const ViewPurchasePage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const t = useTranslations("");
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const titlePage = `${t("Common.detail")} ${t("Sidebar.purchaseOrder")}`;

  const { purchase, billdocs, tblBd, loading, fetch } = useGetPurchaseById();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("invoice");
  const [description, setDescription] = useState<string>("");

  const header = useMemo(
    () => [
      {
        value: t("Sidebar.item"),
        className: "sticky left-0 z-20 text-left text-xs w-[15rem]",
        sort: true,
      },
      {
        value: t("PurchasePage.price"),
        className: "text-left text-xs w-[6rem] p-0",
      },
      {
        value: t("PurchasePage.quantity"),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: t("PurchasePage.discount"),
        className: "text-left text-xs w-[9rem] p-0",
      },
      {
        value: t("PurchasePage.total"),
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

          {!loading && purchase && (
            <div className="justify-betwenn flex gap-x-4 rounded-[1rem] border-2 border-primary p-1">
              <Card className="w-2/3">
                <CardHeader className="bg-[#EAE2E1]">
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
                              <DotsVerticalIcon className="h-4 w-4 text-white" />
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-[1rem] flex flex-col">
                    <div className="flex flex-row capitalize">
                      <span className="w-[35%] capitalize">status</span>{" "}
                      <Badge variant="destructive">
                        {capitalizeStr(purchase.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[35%] capitalize">supplier</span>{" "}
                      <span>{purchase.supplier.company}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[35%] capitalize">
                        purchase method
                      </span>{" "}
                      <span>{purchase.purchPaymentMethod}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[35%] capitalize">billing code</span>{" "}
                      <span>{purchase.billingCode}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[35%] capitalize">so number</span>{" "}
                      <span>{purchase.soNumber}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[35%] capitalize">date</span>{" "}
                      <span>{formatDate(purchase.date)}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="w-[35%] capitalize">expired</span>{" "}
                      <span>{formatDate(purchase.expDate)}</span>
                    </div>
                  </div>
                  <div className="mt-[1rem] rounded-[1rem] bg-[#E2E7E8]">
                    <CustomTable data={tblData} />
                  </div>
                </CardContent>
              </Card>
              <Card className="w-1/3">
                <CardHeader className="bg-[#EAE2E1]">
                  <CardTitle>Files</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <form onSubmit={handleSubmitUpload}>
                    <div className="flex flex-col gap-y-2 rounded-[0.4rem] bg-[#E0EDF0] p-1 py-[0.5rem]">
                      <div className=" flex flex-row gap-x-2">
                        <div>
                          <select
                            name="title"
                            onChange={(e: any) => {
                              setTitle(e.target.value);
                            }}
                          >
                            <option value={"invoice"}>Invoice</option>
                            <option value={"billcode"}>Billing code</option>
                            <option value={"other"}>Other</option>
                          </select>
                        </div>
                      </div>

                      <Input type="file" onChange={handleFileChange} />
                      <Input
                        type="text"
                        name="description"
                        placeholder="Description"
                        onChange={(e: any) => {
                          setDescription(e.target.value);
                        }}
                      />

                      <div className="">
                        <button
                          type="submit"
                          className="flex items-center rounded-[0.5rem] bg-[#5FBEDB] p-1"
                        >
                          <MdDriveFolderUpload />
                          upload
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="mt-[1rem] rounded-[1rem] bg-red-100 p-2">
                    {billdocs && billdocs.length > 1
                      ? billdocs.map((x: any, idx: number) => {
                          const billDocUrl = `${BASE_URL}${billDocURL}`;
                          return (
                            <ol key="file-list">
                              <li key={idx} className="flex justify-between">
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
          )}
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
};

export { getStaticPaths, getStaticProps };

export default ViewPurchasePage;
