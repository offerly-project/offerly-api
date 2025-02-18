import { z } from "zod";
import { entityStatuses } from "../constants";
import { BankType } from "../models/bank.model";
import { languagesSchema } from "./data.validators";

export const createBankSchema = z.object({
	body: z.object({
		country: z.string({ message: "Country is required" }),
		type: z.enum<BankType, [BankType, BankType, BankType]>(
			["regular", "digital", "digital-wallet"],
			{
				message: "Type should be regular, digital, or digital-wallet",
			}
		),
		name: languagesSchema,
		logo: z.string({ message: "Logo is required" }).optional(),
	}),
});

export const updateBankSchema = z.object({
	body: z.object({
		country: z.string().optional(),
		type: z
			.enum<BankType, [BankType, BankType, BankType]>(
				["regular", "digital", "digital-wallet"],
				{
					message: "Type should be regular, digital, or digital-wallet",
				}
			)
			.optional(),
		name: languagesSchema.optional(),
		logo: z.string({ message: "Logo is required" }).optional(),
		status: z.enum(entityStatuses).optional(),
		cards: z.array(z.string()).optional(),
	}),
});

export type CreateBankBodyData = z.infer<typeof createBankSchema>["body"];

export type UpdateBankBodyData = z.infer<typeof updateBankSchema>["body"];
