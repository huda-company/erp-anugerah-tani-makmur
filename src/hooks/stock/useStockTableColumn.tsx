import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { StockTanTblData } from "^/@types/models/stock";
import { STOCK_HIST } from "@/constants/pageURL";

// eslint-disable-next-line unused-imports/no-unused-vars
const useStockTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<StockTanTblData, any>[] = [
    {
      accessorFn: (row) => `${row.branchName}`,
      id: "company",
      header: () => (
        <CstmTstackHeaderCell key="company" str={t("Sidebar.branch")} />
      ),
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.itemName,
      id: "item",
      cell: (info: any) => info.getValue(),
      header: () => <CstmTstackHeaderCell key="item" str={t("Sidebar.item")} />,
      enableColumnFilter: false,
    },

    {
      accessorKey: "stock",
      header: () => (
        <CstmTstackHeaderCell key="stock" str={t("Sidebar.stock")} />
      ),
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
            url: `${STOCK_HIST.PAGE.VIEW}/${suppStockId}`,
            show: true,
            doAction: () =>
              router.push(`${STOCK_HIST.PAGE.VIEW}/${suppStockId}` ?? "#"),
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

export default useStockTableColumn;
