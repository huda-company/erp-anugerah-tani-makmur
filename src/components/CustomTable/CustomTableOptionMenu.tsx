import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { VscSettings } from "react-icons/vsc";
import { CustomTblOptMenuProps, OptMenuItem } from "./types";

const CustomTableOptionMenu: FC<CustomTblOptMenuProps> = ({ item }) => {
  // const addDelivNoteDrpDownItem = () => {
  //   if (addDelivNote) {
  //     return (
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => addDelivNote(rowId)}
  //       >
  //         {`+ ${capitalizeStr(t("Common.create"))} ${capitalizeStr(t("Sidebar.delivNote"))}`}
  //       </DropdownMenuItem>
  //     );
  //   }
  // };

  // const addPickupDocDrpDownItem = () => {
  //   if (addPickupDoc && typeof addPickupDoc !== "undefined") {
  //     return (
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => addPickupDoc(rowId)}
  //       >
  //         {`+ ${capitalizeStr(t("Common.create"))} PPB / SPAA`}
  //       </DropdownMenuItem>
  //     );
  //   }
  // };

  // const genPDFDrpDownItem = () => {
  //   if (doGenPdf) {
  //     return (
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => doGenPdf(rowId)}
  //       >
  //         {`${capitalizeStr(t("Common.create"))} PDF`}
  //       </DropdownMenuItem>
  //     );
  //   }
  // };

  // const viewDrpDownItem = () => {
  //   if (viewURL) {
  //     return (
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => router.push(viewURL ?? "#")}
  //       >
  //         {capitalizeStr(t("Common.view"))}
  //       </DropdownMenuItem>
  //     );
  //   }
  // };

  // const editDrpDownItem = () => {
  //   if (editURL) {
  //     return (
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => router.push(editURL ?? "#")}
  //       >
  //         {capitalizeStr(t("Common.edit"))}
  //       </DropdownMenuItem>
  //     );
  //   }
  // };

  // const deleteDrpDownItem = () => {
  //   if (confirmDel) {
  //     return (
  //       <DropdownMenuItem
  //         className="cursor-pointer"
  //         onClick={() => confirmDel(rowId)}
  //       >
  //         {capitalizeStr(t("Common.delete"))}
  //       </DropdownMenuItem>
  //     );
  //   }
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-gray-300" asChild>
        <Button variant="ghost" className="h-7 w-7 bg-transparent p-0">
          <VscSettings className="h-6 w-6 cursor-pointer bg-transparent" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {item.map(
          (itm: OptMenuItem, idx: number) =>
            itm.show && (
              <DropdownMenuItem
                key={`${idx}-${itm.label}`}
                className="cursor-pointer"
                onClick={itm.doAction}
              >
                {itm.label}
              </DropdownMenuItem>
            )
        )}
        {/* {editDrpDownItem()} */}
        {/* {viewDrpDownItem()} */}
        {/* {addPickupDocDrpDownItem()}
        {addDelivNoteDrpDownItem()}
        {genPDFDrpDownItem()} */}
        {/* {deleteDrpDownItem()} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomTableOptionMenu;
