import Categories from "../../data/categories.json";
import Countries from "../../data/countries.json";

export const validateCountries = (countries: string[] | string) => {
	if (typeof countries === "string") {
		return Countries.includes(countries);
	}

	return countries.every((country) => {
		return Countries.includes(country);
	});
};

export const validateCategories = (categories: string[] | string) => {
	if (typeof categories === "string") {
		return Categories.includes(categories);
	}

	return categories.every((category) => {
		return Categories.includes(category);
	});
};
