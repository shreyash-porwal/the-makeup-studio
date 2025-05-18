"use client";
import DataTable from "react-data-table-component";
import React from "react";
import { CustomDataTableProps } from "@/types/customDataTablePropsTypes";

function CustomDataTable<T>({
  title,
  columns,
  data,
  selectableRows = true,
  pagination = true,
  paginationServer = false,
  totalRows = 0,
  onPageChange,
  onPerRowsChange,
  fixedHeight = "400px", // add a new optional prop to control height
}: CustomDataTableProps<T> & { fixedHeight?: string }) {
  return (
    <div className="rounded-lg shadow bg-white p-4 max-w-full overflow-x-auto">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={totalRows}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onPerRowsChange}
        selectableRows={selectableRows}
        highlightOnHover
        pointerOnHover
        responsive
        dense
        fixedHeader
        fixedHeaderScrollHeight={fixedHeight} // fixed height with vertical scroll
      />
    </div>
  );
}

export default CustomDataTable;
