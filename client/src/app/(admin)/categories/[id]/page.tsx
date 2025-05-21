"use client";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/forms/categoryForm";

const Page = () => {
  const params = useParams();
  const categoryId = params.id as string;

  return <CategoryForm categoryId={categoryId} />;
};

export default Page;
