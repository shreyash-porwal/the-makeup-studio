"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryType } from "@/types/categoryType";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "@/services/operations/categoryAPI";
import { toast } from "sonner";
import { ShowerHead } from "lucide-react";

export const CategoryForm = ({ categoryId }: { categoryId?: string }) => {
  const router = useRouter();

  const isEdit = !!categoryId && categoryId !== "new";
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryType>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && categoryId) {
      const fetchData = async () => {
        setLoading(true);
        const res = await getCategoryById(categoryId);
        if (res?.success) {
          reset({
            catName: res.data.catName,
            catDescription: res.data.catDescription,
          });
        } else {
          toast.error("Failed to load category data");
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [categoryId, isEdit, reset]);

  const onSubmit = async (data: CategoryType) => {
    try {
      if (!isEdit) {
        // Create new category
        const res = await createCategory(data);
        if (res.data.success) {
          toast.success(res?.data?.message || "Category added successfully");
          router.push("/categories");
        } else {
          toast.error(res?.data.message || "Failed to add category");
        }
        router.push("/categories");
      } else {
        const res = await updateCategory(categoryId, data);
        if (res.success) {
          toast.success(res?.message || "Category updated successfully");
          router.push("/categories");
        } else {
          toast.error(res?.message || "Failed to update category");
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(msg || "Failed to create category");
    }
  };

  if (loading) return <p>Loading category data...</p>;

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {categoryId ? "Edit Category" : "Create New Category"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="catName" className="block mb-1 font-semibold">
            Category Name
          </label>
          <input
            id="catName"
            type="text"
            className={`w-full border p-2 rounded ${
              errors.catName ? "border-red-500" : "border-gray-300"
            }`}
            {...register("catName", {
              required: "Category name is required",
              maxLength: {
                value: 100,
                message: "Category name cannot exceed 100 characters",
              },
            })}
          />
          {errors.catName && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.catName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="catDescription" className="block mb-1 font-semibold">
            Description
          </label>
          <textarea
            id="catDescription"
            rows={4}
            className={`w-full border p-2 rounded resize-none ${
              errors.catDescription ? "border-red-500" : "border-gray-300"
            }`}
            {...register("catDescription", {
              required: "Description is required",
              maxLength: {
                value: 200,
                message: "Description cannot exceed 200 characters",
              },
            })}
          />
          {errors.catDescription && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.catDescription.message}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
          {/* Cancel Button - gray border */}
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="w-full md:w-auto px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 hover:border-gray-500"
          >
            Cancel
          </button>

          {/* Reset Button - yellow outline style */}
          <button
            type="button"
            onClick={() => reset()}
            className="w-full md:w-auto px-4 py-2 border border-yellow-500 text-yellow-700 rounded hover:bg-yellow-50 hover:border-yellow-600"
          >
            Reset
          </button>

          {/* Submit Button - primary blue style */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : categoryId !== "new"
              ? "Update"
              : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
