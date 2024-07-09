import { ColumnDef } from "@tanstack/react-table";
import CstmTstackHeaderCell from "@/components/CustomTstackTable/CstmTstackHeaderCell";
import CustomTableOptionMenu from "@/components/CustomTable/CustomTableOptionMenu";
import { OptMenuItem } from "@/components/CustomTable/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { SUPPLIER } from "@/constants/pageURL";
import { SupplierTanTblData } from "^/@types/models/supplier";

const useSupplierTableColumn = (confirmDeletion: (id: string) => void) => {
  const router = useRouter();
  const t = useTranslations("");

  const columns: ColumnDef<SupplierTanTblData, any>[] = [
    {
      accessorFn: (row) => `${row.supplierCode}`,
      id: "supplierCode",
      header: () => <CstmTstackHeaderCell str={t("Common.code")} />,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => `${row.company}`,
      id: "company",
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
      accessorKey: "tel",
      header: () => <CstmTstackHeaderCell str={t("Signup.phone")} />,
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "email",
      accessorFn: (row) => row.email,
      id: "email",
      header: () => <CstmTstackHeaderCell str={t("UserPage.email")} />,
      cell: (info: any) => info.getValue(),
      enableColumnFilter: false,
      meta: {
        filterVariant: "text",
      },
    },
    {
      accessorKey: "action",
      cell: (info: any) => {
        const suppId = info.row.original.id;

        const optItem: OptMenuItem[] = [
          {
            label: capitalizeStr(t("Common.view")),
            url: `${SUPPLIER.PAGE.VIEW}/${suppId}`,
            show: true,
            doAction: () =>
              router.push(`${SUPPLIER.PAGE.VIEW}/${suppId}` ?? "#"),
          },
          {
            label: capitalizeStr(t("Common.edit")),
            url: `${SUPPLIER.PAGE.EDIT}/${suppId}`,
            show: true,
            doAction: () =>
              router.push(`${SUPPLIER.PAGE.EDIT}/${suppId}` ?? "#"),
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
            <CustomTableOptionMenu rowId={suppId} item={optItem} />
          </div>
        );
      },
      header: () => <CstmTstackHeaderCell str={t("Common.action")} />,
      enableColumnFilter: false,
    },
  ];

  return columns;
};

export default useSupplierTableColumn;
