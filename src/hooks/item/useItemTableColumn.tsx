import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { ITEM } from "@/constants/pageURL";
import { ItemTanTblData } from "^/@types/models/item";

const useItemTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<ItemTanTblData, any>[] = [
    {
      accessorFn: (row) => `${row.itemCategoryName}`,
      id: "itemCategory",
      header: () => <CstmTstackHeaderCell str={t("Sidebar.itemCategory")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.name,
      id: "name",
      cell: (info: any) => info.getValue(),
      header: () => <CstmTstackHeaderCell str={t("Signup.name")} />,
      enableColumnFilter: false,
    },

    {
      accessorFn: (row) => `${row.description}`,
      accessorKey: "description",
      header: () => <CstmTstackHeaderCell str={t("Index.description")} />,
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "action",
      cell: (info: any) => {
        const itemId = info.row.original.id;

        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${ITEM.PAGE.VIEW}/${itemId}`,
            show: true,
            doAction: () => router.push(`${ITEM.PAGE.VIEW}/${itemId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${ITEM.PAGE.EDIT}/${itemId}`,
            show: true,
            doAction: () => router.push(`${ITEM.PAGE.EDIT}/${itemId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.delete")),
            url: "#",
            show: true,
            doAction: () => confirmDeletion(itemId),
          },
        ];

        return (
          <div className="align-start flex justify-start">
            <CustomTableOptionMenu rowId={itemId} item={optItem} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useItemTableColumn;
