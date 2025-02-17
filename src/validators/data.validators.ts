import { isNumber } from "lodash";
import { z } from "zod";

export const languagesSchema = z.object({
	en: z.string({ message: "English is required" }).min(1),
	ar: z.string({ message: "Arabic is required" }).min(1),
});

export const commaSeparatedStringSchema = (message: string) =>
	z.string({ message }).refine(
		(value) => {
			const values = value.split(",");
			const allNumbers = values.every((val) => isNumber(Number(val)));

			return allNumbers;
		},
		{
			message,
		}
	);
