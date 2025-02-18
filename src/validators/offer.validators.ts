import { isNumber } from "lodash";
import { z } from "zod";
import { channels, entityStatuses } from "../constants";
import { languagesSchema } from "./data.validators";

export const createOfferSchema = z.object({
	body: z.object({
		description: languagesSchema,
		terms_and_conditions: languagesSchema,
		offer_source_link: z.string(),
		logo: z.string().optional(),
		discount_code: z.string().optional(),
		starting_date: z.coerce.date().optional(),
		expiry_date: z.coerce.date(),
		minimum_amount: z.string().optional(),
		cap: z.string().optional(),
		channels: z.array(z.enum(channels)),
		categories: z.array(z.string()),
		applicable_cards: z.array(z.string()).min(1),
		title: languagesSchema,
	}),
});

export const updateOfferSchema = z.object({
	body: z.object({
		description: languagesSchema.optional(),
		terms_and_conditions: languagesSchema.optional(),
		offer_source_link: z.string().optional(),
		logo: z.string().optional(),
		discount_code: z.string().optional(),
		starting_date: z.coerce.date().optional(),
		expiry_date: z.coerce.date().optional(),
		minimum_amount: z.string().optional(),
		cap: z.string().optional(),

		channels: z.array(z.enum(channels)).optional(),
		categories: z.array(z.string()).optional(),
		applicable_cards: z.array(z.string()).min(1).optional(),
		status: z.enum(entityStatuses).optional(),
		title: languagesSchema.optional(),
	}),
});

export type CreateOfferBodyData = z.infer<typeof createOfferSchema>["body"];
export type UpdateOfferBodyData = z.infer<typeof updateOfferSchema>["body"];

const offerSortBySchema = z.enum([
	"expiry_date",
	"alphabet_ar",
	"alphabet_en",
	"created_at",
]);

const offerSortDirectionSchema = z.enum(["asc", "desc"]);

export const getUserOffersSchema = z.object({
	query: z.object({
		card: z.string().optional(),
		q: z.string().optional(),
		bank: z.string().optional(),
		sort_by: offerSortBySchema.optional(),
		sort_direction: offerSortDirectionSchema.default("asc").optional(),
		category: z.string().optional(),
		page: z
			.string()
			.refine((value) => {
				if (!isNumber(+value)) {
					return true;
				}
				return +value >= 1;
			})
			.optional(),
		limit: z
			.string()
			.refine((value) => {
				if (!isNumber(+value)) {
					return true;
				}
				return +value <= 50 && +value >= 1;
			})
			.optional(),
	}),
});

export type OffersQuery = Omit<
	z.infer<typeof getUserOffersSchema>["query"],
	"page" | "limit"
> & {
	page: string;
	limit: string;
};
