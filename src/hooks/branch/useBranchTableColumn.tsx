import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { BRANCH } from "@/constants/pageURL";
import { BranchResp } from "^/@types/models/branch";

const useBranchTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<BranchResp, any>[] = [
    {
      accessorFn: (row) => `${row.name}`,
      id: "name",
      header: () => <CstmTstackHeaderCell str={t("Signup.name")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.address,
      id: "address",
      cell: (info: any) => info.getValue(),
      header: () => <CstmTstackHeaderCell str={t("ParkingField.address")} />,
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
            url: `${BRANCH.PAGE.VIEW}/${branchId}`,
            show: true,
            doAction: () =>
              router.push(`${BRANCH.PAGE.VIEW}/${branchId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${BRANCH.PAGE.EDIT}/${branchId}`,
            show: true,
            doAction: () =>
              router.push(`${BRANCH.PAGE.EDIT}/${branchId}` ?? "#"),
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
            <CustomTableOptionMenu rowId={branchId} item={optItem} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useBranchTableColumn;
