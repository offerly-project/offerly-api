import { isNumber } from "lodash";
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

export const patchUserCardsschema = z.object({
	body: z.object({
		cards: z.array(z.string({ message: "Card ID is required" })),
	}),
});

export type MutateUserCardsBodyData = z.infer<
	typeof patchUserCardsschema
>["body"];

export const deleteCardSchema = z.object({
	query: z.object({
		cards: z.string({ message: "Card ID is required" }).refine(
			(value) => {
				const values = value.split(",");
				const allNumbers = values.every((val) => isNumber(Number(val)));

				return allNumbers;
			},
			{
				message: "card ids should be separated by commas",
			}
		),
	}),
});

export type DeleteCardQueryData = z.infer<typeof deleteCardSchema>["query"];
