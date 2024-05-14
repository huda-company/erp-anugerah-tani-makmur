import { FC, FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { capitalizeStr } from "^/utils/capitalizeStr";
import useGetPurchaseById from "@/hooks/purchase/useGetPurchaseById";
import { useTranslations } from "next-intl";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { getStaticProps } from "^/utils/getStaticProps";
import CustomToolTip from "../CustomTooltip";
import { MdDriveFolderUpload } from "react-icons/md";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createBilldocAPI } from "^/services/billdoc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useAppDispatch from "@/hooks/useAppDispatch";
import { BASE_URL } from "^/config/env";
import { billDocURL } from "@/constants/uploadDir";
import { FaRegEye } from "react-icons/fa";
import moment from "moment";
import { actions as toastActs } from "@/redux/toast";

const PurchFileSect: FC = () => {
  const t = useTranslations("");
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id } = router.query;

  const { billdocs, fetch } = useGetPurchaseById();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("invoice");
  const [description, setDescription] = useState<string>("");

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

            <div>
              <CustomToolTip
                content={<p>{capitalizeStr(t("Common.submit"))}</p>}
              >
                <button
                  type="submit"
                  className="flex items-center rounded-[0.5rem] bg-[#5FBEDB] p-1"
                >
                  <MdDriveFolderUpload className="h-6 w-16" />
                </button>
              </CustomToolTip>
            </div>
          </div>
        </form>

        <div className="mt-[1rem] rounded-[1rem] bg-[#E0EDF0] p-2">
          {billdocs && Array.isArray(billdocs) && billdocs.length > 0
            ? billdocs.map((x: any, idx: number) => {
                const billDocUrl = `${BASE_URL}${billDocURL}`;
                return (
                  <ol key="file-list">
                    <li key={idx} className="flex items-center justify-between">
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
  );
};

export { getStaticPaths, getStaticProps };

export default PurchFileSect;
