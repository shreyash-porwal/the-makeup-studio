"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomDataTable from "@/components/datatable";
import { CategoryType } from "@/types/categoryType";
import { getCategories } from "@/services/operations/categoryAPI";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Category = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  const router = useRouter();
  // Server-side pagination and sorting states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState("catName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  async function fetchData() {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      sortField,
      sortOrder,
      search,
    });

    const res = await getCategories(`/categories?${params.toString()}`);

    if (res.success) {
      setCategories(res.data.data);
      setTotalRows(res.data.total);
    } else {
      setCategories([]);
      setTotalRows(0);
    }
  }
  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      fetchData();
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setTotalRows(0);
    }
    setLoading(false);
  }, [page, perPage, sortField, sortOrder, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Handle rows per page change
  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  // Handle sorting change
  const handleSort = (column: any, sortDirection: "asc" | "desc") => {
    setSortField(column.field || "catName");
    setSortOrder(sortDirection);
  };

  // Columns for DataTable with a 'field' property for sorting
  const columns = [
    {
      name: "Category Name",
      selector: (row: CategoryType) => row.catName,
      sortable: true,
      field: "catName",
    },
    {
      name: "Description",
      selector: (row: CategoryType) => row.catDescription,
      sortable: true,
      field: "catDescription",
    },
  ];

  return (
    <div>
      {/* <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 mb-4 rounded"
      /> */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded flex-grow max-w-full sm:max-w-xs"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/categories/create")}
          className=" px-4 py-2 rounded hover: transition"
        >
          Add Category
        </Button>
      </div>

      <CustomDataTable
        title="Service Categories"
        columns={columns}
        data={categories}
        selectableRows={false}
        pagination
        paginationServer
        totalRows={totalRows}
        onPageChange={handlePageChange}
        onPerRowsChange={handlePerRowsChange}
        // fixedHeight="500px" // optional, default to 400px if not passed
      />
    </div>
  );
};

export default Category;
