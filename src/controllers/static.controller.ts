import { NextFunction, Request, Response } from "express";
import { categoriesRepository } from "../repositories/categories.repository";
import { countriesRepository } from "../repositories/countries.repository";
import { transformDocsResponse } from "../utils/utils";

const getCountriesHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const countries = await countriesRepository.getCountries();
		res.json(transformDocsResponse(countries));
	} catch (e) {
		next(e);
	}
};

const getCategoriesHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = await categoriesRepository.getCategories();
		res.json(transformDocsResponse(categories));
	} catch (e) {
		next(e);
	}
};

export const staticController = {
	getCountriesHandler,
	getCategoriesHandler,
};
