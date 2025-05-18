"use client";
import { useSearchParams } from "next/navigation";
import { CategoryForm } from "@/components/forms/categoryForm";

const Page = () => {
  const searchParams = useSearchParams();
  // If you prefer URL param (like /categories/[id]), get from route params instead
  // Here we assume ?id=123 query param for simplicity
  const categoryId = searchParams.get("id") ?? undefined;

  return <CategoryForm categoryId={categoryId} />;
};

export default Page;
