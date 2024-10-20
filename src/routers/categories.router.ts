import { Router } from "express";
import { categoriesController } from "../controllers/categories.controller";
import { validateRequest } from "../utils/utils";
import {
	createCategorySchema,
	updateCategorySchema,
} from "../validators/category.validators";

export const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getCategoriesHandler);

categoriesRouter.post(
	"/",
	validateRequest(createCategorySchema),
	categoriesController.createCategoryHandler
);

categoriesRouter.get("/:id", categoriesController.getCategoryHandler);

categoriesRouter.patch(
	"/:id",
	validateRequest(updateCategorySchema),
	categoriesController.updateCategoryHandler
);
