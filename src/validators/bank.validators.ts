import { z } from "zod";
import { BankType } from "../models/bank.model";

export const createBankSchema = z.object({
	body: z.object({
		country: z.string({ message: "Country is required" }),
		type: z.enum<BankType, [BankType, BankType, BankType]>(
			["regular", "digital", "digital-wallet"],
			{
				message: "Type should be regular, digital, or digital-wallet",
			}
		),
		name: z.string({ message: "Name is required" }),
		logo: z.string({ message: "Logo is required" }),
	}),
});

export type CreateBankBodyData = z.infer<typeof createBankSchema>["body"];
