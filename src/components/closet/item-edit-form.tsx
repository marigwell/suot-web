"use client";

import { useState } from "react";
import type { Item } from "@/types/item";

import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import { updateItem } from "@/lib/api";

type ItemEditFormProps = {
    item: Item;
    onCancel: () => void;
}

export function ItemEditForm({
    item,
    onCancel,
}: ItemEditFormProps) {
    const [notes, setNotes] = useState(item.notes ?? "");

    const QueryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: () =>
            updateItem(item.id, {
                notes: notes || null,
            }),
        
        onSuccess: async () => {
            await QueryClient.invalidateQueries({
                queryKey: ["items"],
            });

            onCancel();
        },
    });

    return (
        <div className="mt-4 space-y-3">
            <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes"
                className="w-full border border-neutral-700 bg-transparent px-3 py-2"
            />

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                    className="border border-white px-3 py-1 text-sm disable:opacity-50"
                >
                    {mutation.isPending ? "Saving..." : "Save"}
                </button>
            
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-neutral-700 px-3 py-1 text-sm"
                >
                        Cancel
                </button>
            </div>
        </div>
    );
}