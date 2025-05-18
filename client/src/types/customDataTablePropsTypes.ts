import { TableColumn } from "react-data-table-component";

export interface CustomDataTableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  selectableRows?: boolean;
  pagination?: boolean;
  paginationServer?: boolean;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPerRowsChange?: (perPage: number, page: number) => void;
}
