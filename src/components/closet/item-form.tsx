"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { createItem } from "@/lib/api";
import {
  itemCreateSchema,
  type ItemCreateFormData,
} from "@/schemas/item";

export function ItemForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemCreateFormData>({
    resolver: zodResolver(itemCreateSchema),
  });

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: async () => {
      reset();

      await queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },
  });

  async function onSubmit(data: ItemCreateFormData) {
    await mutation.mutateAsync({
      ...data,
      brand: data.brand || null,
      price: data.price || null,
      purchase_date: data.purchase_date || null,
      condition: data.condition || null,
      notes: data.notes || null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-10 space-y-4 border border-neutral-800 p-5"
    >
      <h2 className="text-xl font-medium">Add Item</h2>

      <div>
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full border border-neutral-700 bg-transparent px-3 py-2"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <input
        {...register("brand")}
        placeholder="Brand"
        className="w-full border border-neutral-700 bg-transparent px-3 py-2"
      />

      <div>
        <input
          {...register("category")}
          placeholder="Category"
          className="w-full border border-neutral-700 bg-transparent px-3 py-2"
        />

        {errors.category && (
          <p className="mt-1 text-sm text-red-400">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <input
          {...register("color")}
          placeholder="Color"
          className="w-full border border-neutral-700 bg-transparent px-3 py-2"
        />

        {errors.color && (
          <p className="mt-1 text-sm text-red-400">
            {errors.color.message}
          </p>
        )}
      </div>

      <div>
        <input
          {...register("size")}
          placeholder="Size"
          className="w-full border border-neutral-700 bg-transparent px-3 py-2"
        />

        {errors.size && (
          <p className="mt-1 text-sm text-red-400">
            {errors.size.message}
          </p>
        )}
      </div>

      <input
        {...register("price")}
        placeholder="Price"
        className="w-full border border-neutral-700 bg-transparent px-3 py-2"
      />

      <input
        {...register("purchase_date")}
        type="date"
        className="w-full border border-neutral-700 bg-transparent px-3 py-2"
      />

      <input
        {...register("condition")}
        placeholder="Condition"
        className="w-full border border-neutral-700 bg-transparent px-3 py-2"
      />

      <textarea
        {...register("notes")}
        placeholder="Notes"
        className="w-full border border-neutral-700 bg-transparent px-3 py-2"
      />

      {mutation.isError && (
        <p className="text-sm text-red-400">
          Unable to create item.
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="border border-white px-4 py-2 disabled:opacity-50"
      >
        {mutation.isPending ? "Adding..." : "Add Item"}
      </button>
    </form>
  );
}