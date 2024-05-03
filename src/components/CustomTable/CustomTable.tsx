import { FC } from "react";
import { Table } from "../ui/table";
import { CustomTblProps } from "./types";
import Image from "next/image";
import CustomTableHeader from "./CustomTableHeader";
import CustomTableBody from "./CustomTableBody";

const CustomTable: FC<CustomTblProps> = ({ data }) => {
  return (
    <>
      <Table>
        <CustomTableHeader data={data} />
        {data && data.body.length > 0 && <CustomTableBody data={data} />}
      </Table>

      {data && data.body.length == 0 && (
        <div className="flex w-full flex-col items-center justify-center">
          <Image
            src={"/empty-folder.png"}
            height={100}
            width={100}
            alt="no data"
          />
          <h1>empty</h1>
        </div>
      )}
    </>
  );
};

export default CustomTable;
