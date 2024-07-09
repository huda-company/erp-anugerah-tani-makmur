import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { ITEM_CAT } from "@/constants/pageURL";
import { IItemCatForm } from "^/@types/models/itemcategory";

const useItemCatTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<IItemCatForm, any>[] = [
    {
      accessorFn: (row) => `${row.name}`,
      id: "name",
      header: () => <CstmTstackHeaderCell str={t("Signup.name")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => `${row.description}`,
      id: "description",
      header: () => <CstmTstackHeaderCell str={t("Index.description")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorKey: "action",
      cell: (info: any) => {
        const itemCatId = info.row.original.id;

        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${ITEM_CAT.PAGE.VIEW}/${itemCatId}`,
            show: true,
            doAction: () =>
              router.push(`${ITEM_CAT.PAGE.VIEW}/${itemCatId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${ITEM_CAT.PAGE.EDIT}/${itemCatId}`,
            show: true,
            doAction: () =>
              router.push(`${ITEM_CAT.PAGE.EDIT}/${itemCatId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.delete")),
            url: "#",
            show: true,
            doAction: () => confirmDeletion(itemCatId),
          },
        ];

        return (
          <div className="align-start flex justify-start">
            <CustomTableOptionMenu rowId={itemCatId} item={optItem} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useItemCatTableColumn;
