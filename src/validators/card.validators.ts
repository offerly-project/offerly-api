import { z } from "zod";
import { languagesSchema } from "./data.validators";

export const createCardSchema = z.object({
	body: z.object({
		bank: z.string({ message: "Card Bank is required" }),
		name: languagesSchema,
		logo: z.string({ message: "Card Logo is required" }).optional(),
		grade: languagesSchema,
		scheme: languagesSchema,
	}),
});

export const updateCardSchema = z.object({
	body: z.object({
		bank: z.string().optional(),
		name: languagesSchema.optional(),
		logo: z.string().optional(),
		grade: languagesSchema.optional(),
		scheme: languagesSchema.optional(),
		status: z.enum(["enabled", "disabled"]).optional(),
		offers: z.array(z.string()).optional(),
	}),
});

export type CreateCardBodyData = z.infer<typeof createCardSchema>["body"];

export type UpdateCardBodyData = z.infer<typeof updateCardSchema>["body"];

export const updateUserCardsSchema = z.object({
	body: z.object({
		cards: z.array(z.string({ message: "Card ID is required" })),
	}),
});

export type UpdateUserCardsBodyData = z.infer<
	typeof updateUserCardsSchema
>["body"];
