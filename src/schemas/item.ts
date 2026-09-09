import { z } from "zod";

export const itemCreateSchema = z.object({
    name: z.string().min(1, "Name is required."),
    brand: z.string().optional(),
    category: z.string().min(1, "Category is required."),
    color: z.string().min(1, "Color is required."),
    size: z.string().min(1, "Size is required."),
    price: z.string().optional(),
    purchase_date: z.string().optional(),
    condition: z.string().optional(),
    notes: z.string().optional(),
});

export type ItemCreateFormData = z.infer<typeof itemCreateSchema>;