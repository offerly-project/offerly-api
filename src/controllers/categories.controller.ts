import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { categoriesService } from "../services/categories.service";
import { transformDocsResponse } from "../utils/utils";
import {
	CreateCategoryBodyData,
	UpdateCategoryBodyData,
} from "../validators/category.validators";

const createCategoryHandler = async (
	req: Request<{}, {}, CreateCategoryBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name } = req.body;
		const id = await categoriesService.createCategory({ name });
		res.status(StatusCodes.OK).send({ id });
	} catch (error) {
		next(error);
	}
};

const getCategoriesHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = await categoriesService.getAllCategories();
		res.status(StatusCodes.OK).send(transformDocsResponse(categories));
	} catch (error) {
		next(error);
	}
};

const getCategoryHandler = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const category = await categoriesService.getCategory(id);
		res.status(StatusCodes.OK).send(transformDocsResponse(category));
	} catch (e) {
		next(e);
	}
};

const updateCategoryHandler = async (
	req: Request<{ id: string }, {}, UpdateCategoryBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const data = req.body;
		await categoriesService.updateCategory(id, data);
		res.status(StatusCodes.OK).send({ message: "Category details updated" });
	} catch (error) {
		next(error);
	}
};

export const categoriesController = {
	createCategoryHandler,
	getCategoriesHandler,
	getCategoryHandler,
	updateCategoryHandler,
};
