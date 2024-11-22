import { z } from "zod";

// NON-MVP CODE

export const createStoreSchema = z.object({
	body: z.object({
		name: z.string({ message: "Store Name is required" }),
		logo: z.string({ message: "Store Logo is required" }),
		locations: z.array(z.string({ message: "Store Location is required" })),
		website_link: z.string({ message: "Store Website Link is required" }),
	}),
});

export const updateStoreSchema = z.object({
	body: z.object({
		name: z.string().optional(),
		logo: z.string().optional(),
		locations: z.array(z.string()).optional(),
		website_link: z.string().optional(),
		offers: z.array(z.string()).optional(),
	}),
});

export type CreateStoreBodyData = z.infer<typeof createStoreSchema>["body"];

export type UpdateStoreBodyData = z.infer<typeof updateStoreSchema>["body"];
