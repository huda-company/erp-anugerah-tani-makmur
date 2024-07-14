import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { USER } from "@/constants/pageURL";
import { UserResp } from "^/@types/models/user";

const useUserTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<UserResp, any>[] = [
    {
      accessorFn: (row) => `${row.name}`,
      id: "name",
      header: () => <CstmTstackHeaderCell str={t("Signup.name")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => `${row.email}`,
      accessorKey: "email",
      header: () => <CstmTstackHeaderCell str={t("UserPage.email")} />,
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorFn: (row) => `${row.enabled}`,
      accessorKey: "active",
      header: () => <CstmTstackHeaderCell str={t("UserPage.isActive")} />,
      enableColumnFilter: false,
      cell: (info) => (info.getValue() ? "active" : "inactive"),
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "action",
      cell: (info: any) => {
        const usrId = info.row.original.id;

        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${USER.PAGE.VIEW}/${usrId}`,
            show: true,
            doAction: () => router.push(`${USER.PAGE.VIEW}/${usrId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${USER.PAGE.EDIT}/${usrId}`,
            show: true,
            doAction: () => router.push(`${USER.PAGE.EDIT}/${usrId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.delete")),
            url: "#",
            show: true,
            doAction: () => confirmDeletion(usrId),
          },
        ];

        return (
          <div className="align-start flex justify-start">
            <CustomTableOptionMenu rowId={usrId} item={optItem} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useUserTableColumn;
