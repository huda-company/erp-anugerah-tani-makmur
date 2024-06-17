import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { VscSettings } from "react-icons/vsc";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { useTranslations } from "next-intl";
import { CustomTblOptMenuProps } from "./types";
import { useRouter } from "next/navigation";

const CustomTableOptionMenu: FC<CustomTblOptMenuProps> = ({
  viewURL,
  editURL,
  rowId,
  confirmDel,
  addPickupDoc,
  doGenPdf,
}) => {
  const t = useTranslations("");

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-gray-300" asChild>
        <Button variant="ghost" className="h-7 w-7 bg-transparent p-0">
          <VscSettings className="h-6 w-6 cursor-pointer bg-transparent" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {editURL && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(editURL ?? "#")}
          >
            {capitalizeStr(t("Common.edit"))}
          </DropdownMenuItem>
        )}

        {viewURL && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(viewURL ?? "#")}
          >
            {capitalizeStr(t("Common.view"))}
          </DropdownMenuItem>
        )}

        {addPickupDoc && typeof addPickupDoc !== "undefined" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => addPickupDoc(rowId)}
          >
            {`+ ${capitalizeStr(t("Common.create"))} PPB / SPAA`}
          </DropdownMenuItem>
        )}

        {doGenPdf && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => doGenPdf(rowId)}
          >
            {`${capitalizeStr(t("Common.create"))} PDF`}
          </DropdownMenuItem>
        )}

        {confirmDel && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => confirmDel(rowId)}
          >
            {capitalizeStr(t("Common.delete"))}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomTableOptionMenu;
