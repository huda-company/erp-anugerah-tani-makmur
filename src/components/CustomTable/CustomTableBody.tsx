import { FC } from "react";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { CustomTablItem, CustomTblBody, CustomTblProps } from "./types";
import Image from "next/image";

const CustomTableBody: FC<CustomTblProps> = ({ data }) => {
  return (
    <>
      {data && data.body && data.body.length > 0 && (
        <TableBody>
          {data && data.body.length > 0 ? (
            data.body.map((row: CustomTblBody, rowIdx: number) => {
              return (
                <TableRow key={`rowIdx-${rowIdx}`}>
                  {row.items.map((itm: CustomTablItem, itmIdx: number) => {
                    return (
                      <TableCell
                        key={`rowIdx-${rowIdx}--itmId-${itmIdx}`}
                        className="font-medium"
                      >
                        {itm.value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <></>
          )}
        </TableBody>
      )}
    </>
  );
};

export default CustomTableBody;
