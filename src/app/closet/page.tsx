"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ItemForm } from "@/components/closet/item-form";
import { ItemEditForm } from "@/components/closet/item-edit-form";
import { getItems, deleteItem } from "@/lib/api";


export default function ClosetPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },
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

            {editingItemId === item.id ? (
              <ItemEditForm
                item={item}
                onCancel={() => setEditingItemId(null)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingItemId(item.id)}
                className="mt-3 border border-neutral-700 px-3 py-1 text-sm"
              >
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() => deleteMutation.mutate(item.id)}
              disabled={deleteMutation.isPending}
              className="mt-3 border border-neutral-700 px-3 py-1 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}