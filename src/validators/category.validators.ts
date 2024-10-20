import { z } from "zod";

export const createCategorySchema = z.object({
	body: z.object({
		name: z.string({ message: "Name is required" }),
	}),
});

export const updateCategorySchema = z.object({
	body: z.object({
		name: z.string().optional(),
		offers: z.array(z.string()).optional(),
	}),
});

export type CreateCategoryBodyData = z.infer<
	typeof createCategorySchema
>["body"];
export type UpdateCategoryBodyData = z.infer<
	typeof updateCategorySchema
>["body"];
