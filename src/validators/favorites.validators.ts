import { z } from "zod";
import { commaSeparatedStringSchema } from "./data.validators";

export const patchUserFavoriteOffersSchema = z.object({
	body: z.object({
		offers: z.array(z.string()),
	}),
});

export const deleteUserFavoriteOffersSchema = z.object({
	query: z.object({
		offers: commaSeparatedStringSchema(
			"offer ids should be separated by commas"
		),
	}),
});

export type PatchUserFavoriteOffersInput = z.infer<
	typeof patchUserFavoriteOffersSchema
>["body"];

export type DeleteUserFavoriteOffersInput = z.infer<
	typeof deleteUserFavoriteOffersSchema
>["query"];
