import { FC } from "react";
import { TableHead, TableHeader, TableRow } from "../ui/table";
import { CustomTblProps } from "./types";

const CustomTableHeader: FC<CustomTblProps> = ({ data }) => {
  return (
    <>
      <TableHeader className="rounded-lg border-2 border-primary bg-[#98DC65]">
        <TableRow>
          {data &&
            data.header &&
            data.header.map((hdr, idx: number) => {
              return (
                <TableHead className="text-black" key={`header-${idx}`}>
                  {hdr.value}
                </TableHead>
              );
            })}
        </TableRow>
      </TableHeader>
    </>
  );
};

export default CustomTableHeader;
