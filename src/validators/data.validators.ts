import { isNumber } from "lodash";
import { z } from "zod";
import { ConstantsService } from "../services/constants.service";

export const validateCountries = async (countries: string[] | string) => {
	const COUNTRIES = await ConstantsService.getCountries();
	if (typeof countries === "string") {
		return COUNTRIES.includes(countries);
	}

	return countries.every((country) => {
		return COUNTRIES.includes(country);
	});
};

export const validateCategories =
	(optional = false) =>
	async (categories?: string[] | string) => {
		if (!categories && optional) return true;
		const CATEGORIES = await ConstantsService.getCategories();

		if (typeof categories === "string") {
			const cats = categories.split(",");

			return cats.every((cat) => CATEGORIES.includes(cat));
		}

		return categories?.every((category) => {
			return CATEGORIES.includes(category);
		});
	};

export const languagesSchema = z.object({
	en: z.string({ message: "English  is required" }).min(1),
	ar: z.string({ message: "Arabic  is required" }).min(1),
});

export const commaSeparatedStringSchema = (message: string) =>
	z.string({ message: "Card ID is required" }).refine(
		(value) => {
			const values = value.split(",");
			const allNumbers = values.every((val) => isNumber(Number(val)));

			return allNumbers;
		},
		{
			message,
		}
	);
