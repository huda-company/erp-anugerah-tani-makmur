import { FC } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CustomTablItem, CustomTblBody, CustomTblProps } from "./types";
import Image from "next/image";

const CustomTableHeader: FC<CustomTblProps> = ({ data }) => {
  return (
    <>
      <TableHeader>
        <TableRow>
          {data &&
            data.header &&
            data.header.map((hdr, idx: number) => {
              return <TableHead key={`header-${idx}`}>{hdr.value}</TableHead>;
            })}
        </TableRow>
      </TableHeader>
    </>
  );
};

export default CustomTableHeader;
