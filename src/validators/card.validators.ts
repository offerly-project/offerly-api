import { z } from "zod";

export const createCardSchema = z.object({
	body: z.object({
		bank: z.string({ message: "Card Bank is required" }),
		name: z.string({ message: "Card Name is required" }),
		logo: z.string({ message: "Card Logo is required" }).optional(),
		grade: z.string({ message: "Card Grade is required" }),
		scheme: z.string({ message: "Card Scheme is required" }),
	}),
});

export const updateCardSchema = z.object({
	body: z.object({
		bank: z.string().optional(),
		name: z.string().optional(),
		logo: z.string().optional(),
		grade: z.string().optional(),
		scheme: z.string().optional(),
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
