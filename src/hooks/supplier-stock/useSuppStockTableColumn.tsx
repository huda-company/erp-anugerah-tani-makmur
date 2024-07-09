import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { SuppStockTanTblData } from "^/@types/models/supplierstock";
import { SUPP_STOCK_HIST } from "@/constants/pageURL";

const useSuppStockTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<SuppStockTanTblData, any>[] = [
    {
      accessorFn: (row) => `${row.suppName}`,
      id: "company",
      header: () => <CstmTstackHeaderCell str={t("Sidebar.supplier")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.itemName,
      id: "item",
      cell: (info: any) => info.getValue(),
      header: () => <CstmTstackHeaderCell str={t("Sidebar.item")} />,
      enableColumnFilter: false,
    },

    {
      accessorKey: "stock",
      header: () => <CstmTstackHeaderCell str={t("Sidebar.stock")} />,
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
            url: `${SUPP_STOCK_HIST.PAGE.ROOT}/${suppStockId}`,
            show: true,
            doAction: () =>
              router.push(`${SUPP_STOCK_HIST.PAGE.ROOT}/${suppStockId}` ?? "#"),
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

export default useSuppStockTableColumn;
