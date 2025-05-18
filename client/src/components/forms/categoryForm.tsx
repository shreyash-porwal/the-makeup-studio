"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

type FormData = {
  catName: string;
  catDescription: string;
};

type Category = {
  id: string;
  catName: string;
  catDescription: string;
};

export const CategoryForm = ({ categoryId }: { categoryId?: string }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);

  // If editing, fetch the existing category data
  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);
    fetch(`/categories/${categoryId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json: { data: Category }) => {
        const cat = json.data;
        setValue("catName", cat.catName);
        setValue("catDescription", cat.catDescription);
      })
      .catch(() => alert("Error loading category data"))
      .finally(() => setLoading(false));
  }, [categoryId, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data submitted:", data);
      // const method = categoryId ? "PUT" : "POST";
      // const url = categoryId ? `/categories/${categoryId}` : "/categories";

      // const res = await fetch(url, {
      //   method,
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      // if (res.ok) {
      //   router.push("/categories");
      // } else {
      //   alert("Failed to save category.");
      // }
    } catch (err) {
      alert("Error saving category.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading category data...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow-md">
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
            {...register("catName", { required: "Category name is required" })}
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
            })}
          />
          {errors.catDescription && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.catDescription.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : categoryId ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
