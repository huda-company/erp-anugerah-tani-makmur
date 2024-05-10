import { FC } from "react";
import { PaginationCustomProp } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { pageRowsArr } from "./config";

const PgntRowCmpnt: FC<PaginationCustomProp> = ({
  row = pageRowsArr[0],
  onPageRowChange,
}) => {
  const handleOptChange = (prm: string) => {
    row != Number(prm) && onPageRowChange && onPageRowChange(Number(prm));
  };
  return (
    <>
      <h1 className="text-md font-semibold">Show</h1>
      <Select onValueChange={handleOptChange}>
        <SelectTrigger className="h-[1.6rem] w-[4rem]">
          <SelectValue placeholder={row} />
        </SelectTrigger>
        <SelectContent className="w-[4rem] justify-center">
          {pageRowsArr.map((obj, i) => {
            return (
              <SelectItem value={String(obj)} key={i}>
                {obj}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <h1 className="text-md font-semibold">rows</h1>
    </>
  );
};

export default PgntRowCmpnt;
