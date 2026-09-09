"use client";

import { useQuery } from "@tanstack/react-query";

import { ItemForm } from "@/components/closet/item-form";
import { getItems } from "@/lib/api";

export default function ClosetPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  if (isLoading) {
    return <main className="p-8">Loading closet...</main>;
  }

  if (isError) {
    return <main className="p-8">Unable to load closet.</main>;
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-3xl font-semibold">
        Your Closet
      </h1>

      <p className="mb-8 text-neutral-500">
        {data?.total ?? 0} items
      </p>

      <ItemForm />

      <div className="space-y-4">
        {data?.items.map((item) => (
          <div
            key={item.id}
            className="border border-neutral-800 p-4"
          >
            <h2 className="font-medium">
              {item.name}
            </h2>

            <p className="text-sm text-neutral-500">
              {item.brand ?? "Unknown brand"} · {item.category}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}