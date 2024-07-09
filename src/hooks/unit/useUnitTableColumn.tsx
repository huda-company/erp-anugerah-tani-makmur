import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { IUnitForm } from "^/@types/models/unit";
import { UNIT } from "@/constants/pageURL";

const useUnitTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<IUnitForm, any>[] = [
    {
      accessorFn: (row) => `${row.name}`,
      id: "name",
      header: () => <CstmTstackHeaderCell str={t("Signup.name")} />,
      cell: (info) => info.getValue(),
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
        const branchId = info.row.original.id;
        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${UNIT.PAGE.VIEW}/${branchId}`,
            show: true,
            doAction: () => router.push(`${UNIT.PAGE.VIEW}/${branchId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${UNIT.PAGE.EDIT}/${branchId}`,
            show: true,
            doAction: () => router.push(`${UNIT.PAGE.EDIT}/${branchId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.delete")),
            url: "#",
            show: true,
            doAction: () => confirmDeletion(branchId),
          },
        ];
        return (
          <div className="align-start flex justify-start">
            <CustomTableOptionMenu item={optItem} rowId={branchId} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useUnitTableColumn;
