import { FC, useMemo } from "react";

import { useTranslations } from "next-intl";
import { getStaticPaths } from "^/utils/getStaticPaths";
import { getStaticProps } from "^/utils/getStaticProps";
import { useSession } from "next-auth/react";
import { CustomTblData } from "../CustomTable/types";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { Card, CardContent } from "../ui/card";
import CustomTable from "../CustomTable/CustomTable";
import Loading from "../Loading";
import EmptyContent from "../EmptyContent/EmptyContent";
import useGetDelivNoteById from "@/hooks/delivery-note/useGetDelivNoteById";

const DelivNoteDetailSect: FC = () => {
  const t = useTranslations("");

  const { status, data: session } = useSession();

  const {
    delivNote,
    tblBd,
    delivNoteLoading: loading,
  } = useGetDelivNoteById(session);

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
      {status == "loading" || (loading && <Loading />)}

      {status == "authenticated" && !loading && delivNote ? (
        <Card className="">
          <CardContent>
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

export default DelivNoteDetailSect;
