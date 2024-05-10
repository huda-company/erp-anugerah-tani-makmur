import { FC, useEffect, useState } from "react";
import { PaginationCustomProp } from "./types";
import { Input } from "../ui/input";
import { handleFocusSelectAll } from "^/utils/helpers";
import useDebounce from "@/hooks/useDebounce";

const PgntInputCmpnt: FC<PaginationCustomProp> = ({
  page,
  totalPages,
  onPageInputChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<number>(page);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Adjust delay as needed

  // Your logic here that depends on the debounced value
  // For example, you might want to trigger an API call with the debounced value
  useEffect(() => {
    // Perform API call with debouncedSearchTerm
    // Example: fetchSearchResults(debouncedSearchTerm);
    setSearchTerm(debouncedSearchTerm);
    onPageInputChange &&
      page != debouncedSearchTerm &&
      onPageInputChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onPageInputChange, page]);

  return (
    <>
      <h1 className="text-md font-semibold">Page</h1>

      <Input
        value={searchTerm}
        className="align-center h-[1.5rem] w-10 px-2"
        onChange={(e) => setSearchTerm(Number(e.target.value))}
        onFocus={handleFocusSelectAll}
      />

      <h1 className="text-md font-semibold">of {totalPages}</h1>
    </>
  );
};

export default PgntInputCmpnt;
