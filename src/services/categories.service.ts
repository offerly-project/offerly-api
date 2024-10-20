import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { ICategory } from "../models/category.model";
import { categoriesRepostiory } from "../repositories/categories.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateCategoryBodyData,
	UpdateCategoryBodyData,
} from "../validators/category.validators";

export class CategoriesService {
	async createCategory(data: CreateCategoryBodyData) {
		const categoryExists = await categoriesRepostiory.categoryNameExists(
			data.name
		);

		if (categoryExists) {
			throw new BadRequestError("Category already exists");
		}

		const category: ICategory = {
			name: data.name,
			offers: [],
		};
		const id = await categoriesRepostiory.create(category);

		return id;
	}

	async getAllCategories() {
		return await categoriesRepostiory.getAll();
	}

	async getCategoryById(id: string) {
		const category = await categoriesRepostiory.getById(id);
		if (!category) {
			throw new NotFoundError("Category not found");
		}
		return category;
	}

	async updateCategory(id: string, data: UpdateCategoryBodyData) {
		const category = await categoriesRepostiory.getById(id);
		if (!category) {
			throw new NotFoundError("Category not found");
		}
		if (data.name) {
			const categoryDoc = await categoriesRepostiory.findByName(data.name);
			if (categoryDoc && categoryDoc._id?.toString() !== id) {
				throw new BadRequestError("Category with same name exists");
			}
		}
		const patchData: Partial<ICategory> = removeUndefinedValuesFromObject({
			name: data.name,
			offers: data.offers?.map((offer) => new ObjectId(offer)),
		});
		await categoriesRepostiory.update(id, patchData);
	}
}

export const categoriesService = new CategoriesService();
