import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { DELIV_NOTE } from "@/constants/pageURL";
import { DelivNoteTanTblData } from "^/@types/models/deliverynote";
import { formatDate } from "^/utils/dateFormatting";
import { thsandSep } from "^/utils/helpers";

const useDelivNoteTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<DelivNoteTanTblData, any>[] = [
    {
      accessorFn: (row) => row.createdAt,
      id: "createdAt",
      cell: (info: any) => formatDate(info.getValue()),
      header: () => <CstmTstackHeaderCell str={t("PurchasePage.date")} />,
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.code,
      id: "code",
      cell: (info: any) => info.getValue(),
      header: () => <CstmTstackHeaderCell str={t("Common.code")} />,
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => `${row.branchName}`,
      id: "branchName",
      header: () => (
        <CstmTstackHeaderCell
          str={`${t("Sidebar.branch")} ${t("Common.destination")}`}
        />
      ),
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => `${row.driverName}`,
      id: "driverName",
      header: () => (
        <CstmTstackHeaderCell str={`${t("PurchasePage.driverName")}`} />
      ),
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => `${row.purchaseTotal}`,
      id: "purchaseTotal",
      header: () => <CstmTstackHeaderCell str={t("DelivNote.purchaseTotal")} />,
      cell: (info) => thsandSep(Number(info.getValue())),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.sellingTotal,
      id: "sellingTotal",
      cell: (info: any) => thsandSep(Number(info.getValue())),
      header: () => <CstmTstackHeaderCell str={t("DelivNote.sellingTotal")} />,
      enableColumnFilter: false,
    },
    {
      accessorKey: "action",
      cell: (info: any) => {
        const suppId = info.row.original.id;
        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${DELIV_NOTE.PAGE.VIEW}/${suppId}`,
            show: true,
            doAction: () =>
              router.push(`${DELIV_NOTE.PAGE.VIEW}/${suppId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${DELIV_NOTE.PAGE.EDIT}/${suppId}`,
            show: true,
            doAction: () =>
              router.push(`${DELIV_NOTE.PAGE.EDIT}/${suppId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.delete")),
            url: "#",
            show: true,
            doAction: () => confirmDeletion(suppId),
          },
        ];
        return (
          <div className="align-start flex justify-start">
            <CustomTableOptionMenu item={optItem} rowId={suppId} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useDelivNoteTableColumn;
