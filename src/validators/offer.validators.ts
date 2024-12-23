import { isNumber } from "lodash";
import { z } from "zod";
import { channels, entityStatuses } from "../constants";
import { languagesSchema, validateCategories } from "./data.validators";

export const createOfferSchema = z.object({
	body: z.object({
		description: languagesSchema,
		terms_and_conditions: languagesSchema,
		offer_source_link: z.string({ message: "Offer source link is required" }),
		logo: z.string().optional(),
		discount_code: z.string().optional(),
		starting_date: z.coerce.date().optional(),
		expiry_date: z.string(),
		minimum_amount: z
			.number({ message: "Minimum amount is required" })
			.optional(),
		cap: z.string().optional(),
		channels: z.array(z.enum(channels)),
		categories: z
			.array(z.string({ message: "Categories are required" }))
			.refine(validateCategories()),
		applicable_cards: z.array(z.string({ message: "Cards are required" })),
		title: languagesSchema,
	}),
});

export const updateOfferSchema = z.object({
	body: z.object({
		description: languagesSchema.optional(),
		terms_and_conditions: languagesSchema.optional(),
		offer_source_link: z
			.string({ message: "Offer source link is required" })
			.optional(),
		logo: z.string().optional(),
		discount_code: z.string().optional(),
		starting_date: z.coerce.date().optional(),
		expiry_date: z.string().optional(),
		minimum_amount: z
			.number({ message: "Minimum amount is required" })
			.optional(),
		cap: z.string().optional(),
		channels: z.enum(channels).optional(),
		categories: z
			.array(z.string({ message: "Categories are required" }))
			.refine(validateCategories()),
		applicable_cards: z
			.array(z.string({ message: "Card IDs are required" }))
			.optional(),
		status: z.enum(entityStatuses).optional(),
		title: languagesSchema.optional(),
	}),
});

export type CreateOfferBodyData = z.infer<typeof createOfferSchema>["body"];
export type UpdateOfferBodyData = z.infer<typeof updateOfferSchema>["body"];

export const getUserOffersSchema = z.object({
	query: z.object({
		card: z.string(),
		q: z.string().optional(),
		category: z.string().optional().refine(validateCategories(true)),
		page: z.string().refine((value) => {
			if (!isNumber(+value)) {
				return false;
			}
			return +value >= 1;
		}),
		limit: z.string().refine((value) => {
			if (!isNumber(+value)) {
				return false;
			}
			return +value <= 20 && +value >= 1;
		}),
	}),
});

export type OffersQuery = z.infer<typeof getUserOffersSchema>["query"];
