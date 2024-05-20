import { ColumnDef, Table } from "@tanstack/react-table";

export interface CstmTstackTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  globalFilter?: string;
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>;
  handleResetFilter: () => void;
}

export interface CstmTstackPaginationProps {
  table: Table<any>;
  handlePrevClick: () => void;
  handleNextClick: () => void;
  handlePageInputChange: (page: number) => void;
  handlePageRowChange: (pageSize: number) => void;
  handleFirstPageClick: () => void;
  handleLastPageClick: () => void;
}
