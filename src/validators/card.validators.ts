import { z } from "zod";

export const createCardSchema = z.object({
	body: z.object({
		bank: z.string({ message: "Card Bank is required" }),
		name: z.string({ message: "Card Name is required" }),
		logo: z.string({ message: "Card Logo is required" }),
		grade: z.string({ message: "Card Grade is required" }),
		scheme: z.string({ message: "Card Scheme is required" }),
	}),
});

export type CreateCardBodyData = z.infer<typeof createCardSchema>["body"];
