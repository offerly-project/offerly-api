import { z } from "zod";
import { validateCategories } from "./data.validators";

export const createOfferSchema = z.object({
	body: z.object({
		description: z.string({ message: "Description is required" }),
		terms_and_conditions: z.string({
			message: "Terms and conditions are required",
		}),
		offer_source_link: z.string({ message: "Offer source link is required" }),
		logo: z.string().optional(),
		discount_code: z.string().optional(),
		starting_date: z.coerce.date().optional(),
		expiry_date: z.coerce.date({ message: "Expiry date is required" }),
		minimum_amount: z
			.number({ message: "Minimum amount is required" })
			.optional(),
		cap: z.number().optional(),
		channel: z.enum(["online", "offline"]),
		categories: z
			.array(z.string({ message: "Categories are required" }))
			.refine(validateCategories),
		applicable_cards: z.array(z.string({ message: "Cards are required" })),
		title: z.string({ message: "Title is required" }),
	}),
});

export const updateOfferSchema = z.object({
	body: z.object({
		description: z.string({ message: "Description is required" }).optional(),
		terms_and_conditions: z
			.string({
				message: "Terms and conditions are required",
			})
			.optional(),
		offer_source_link: z
			.string({ message: "Offer source link is required" })
			.optional(),
		logo: z.string().optional(),
		discount_code: z.string().optional(),
		starting_date: z.coerce.date().optional(),
		expiry_date: z.coerce
			.date({ message: "Expiry date is required" })
			.optional(),
		minimum_amount: z
			.number({ message: "Minimum amount is required" })
			.optional(),
		cap: z.number().optional(),
		channel: z.enum(["online", "offline"]).optional(),
		categories: z
			.array(z.string({ message: "Categories are required" }))
			.refine(validateCategories),
		applicable_cards: z
			.array(z.string({ message: "Card IDs are required" }))
			.optional(),
		status: z.enum(["enabled", "disabled"]).optional(),
		title: z.string({ message: "Title is required" }).optional(),
	}),
});

export type CreateOfferBodyData = z.infer<typeof createOfferSchema>["body"];
export type UpdateOfferBodyData = z.infer<typeof updateOfferSchema>["body"];
