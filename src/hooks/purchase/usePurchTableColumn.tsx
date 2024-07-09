import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { PO } from "@/constants/pageURL";
import { PurchTanTblData } from "^/@types/models/purchase";
import { formatDate } from "^/utils/dateFormatting";

const usePurchTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<PurchTanTblData, any>[] = [
    {
      accessorFn: (row) => `${row.poNo}`,
      id: "poNo",
      header: () => <CstmTstackHeaderCell str={t("PurchasePage.poNo")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.supplierName,
      id: "supplier",
      cell: (info: any) => info.getValue(),
      header: () => <CstmTstackHeaderCell str={t("Sidebar.supplier")} />,
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => `${row.expDate}`,
      accessorKey: "expDate",
      header: () => <CstmTstackHeaderCell str={t("PurchasePage.expDate")} />,
      cell: (info: any) => formatDate(info.getValue()),
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorFn: (row) => `${row.year}`,
      accessorKey: "year",
      header: () => <CstmTstackHeaderCell str={t("PurchasePage.year")} />,
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorFn: (row) => `${row.status}`,
      accessorKey: "status",
      header: () => <CstmTstackHeaderCell str={t("PurchasePage.status")} />,
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "action",
      cell: (info: any) => {
        const poId = info.row.original.id;
        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${PO.PAGE.VIEW}/${poId}`,
            show: true,
            doAction: () => router.push(`${PO.PAGE.VIEW}/${poId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${PO.PAGE.EDIT}/${poId}`,
            show: true,
            doAction: () => router.push(`${PO.PAGE.EDIT}/${poId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.delete")),
            url: "#",
            show: true,
            doAction: () => confirmDeletion(poId),
          },
        ];
        return (
          <div className="align-start flex justify-start">
            <CustomTableOptionMenu item={optItem} rowId={poId} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default usePurchTableColumn;
