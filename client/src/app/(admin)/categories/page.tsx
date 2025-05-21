"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomDataTable from "@/components/datatable";
import { CategoryType } from "@/types/categoryType";
import {
  deleteCategory,
  getCategories,
} from "@/services/operations/categoryAPI";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const Category = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    {
      name: "Actions",
      cell: (row: CategoryType) => (
        <div className="flex space-x-2 my-1">
          <Button
            variant="outline"
            className="text-blue-600 border-blue-600"
            onClick={() => router.push(`/categories/${row._id}`)}
          >
            Edit
          </Button>

          <Button
            variant={"destructive"}
            // className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition"
            onClick={() => handleDeleteConfirm(row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteConfirm = (id: string) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleDelete(id);
        console.log("Resss", res);
        if (res?.success == true) {
          toast.success(res.data);
          // MySwal.fire("Deleted!", "Your record has been deleted.", "success");
          fetchCategories();
        }
      }
    });
  };

  // Your actual delete function
  const handleDelete = async (id: string) => {
    // your delete logic here (API call, state update, etc.)
    console.log("Deleted id:", id);
    const res = await deleteCategory(id);
    return res;
  };

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
          onClick={() => router.push("/categories/new")}
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
