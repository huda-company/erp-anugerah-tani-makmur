import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { CASHFLOW_HIST } from "@/constants/pageURL";
import { thsandSep } from "^/utils/helpers";
import { CashflowTanTblData } from "^/@types/models/cashflow";

// eslint-disable-next-line unused-imports/no-unused-vars
const useCashflowTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<CashflowTanTblData, any>[] = [
    {
      accessorFn: (row) => `${row.branchName}`,
      id: "company",
      header: () => <CstmTstackHeaderCell str={t("Sidebar.branch")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorKey: "balance",
      cell: (info) => thsandSep(info.getValue()),
      header: () => <CstmTstackHeaderCell str={t("Common.amount")} />,
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "action",
      cell: (info: any) => {
        const suppStockId = info.row.original.id;
        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${CASHFLOW_HIST.PAGE.ROOT}/${suppStockId}`,
            show: true,
            doAction: () =>
              router.push(`${CASHFLOW_HIST.PAGE.ROOT}/${suppStockId}` ?? "#"),
          },
        ];
        return (
          <div className="align-start flex justify-start">
            <CustomTableOptionMenu rowId={suppStockId} item={optItem} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useCashflowTableColumn;
