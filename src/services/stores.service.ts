import { ObjectId } from "mongodb";
import { ConflictError, NotFoundError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IStore } from "../models/store.model";
import { storesRepository } from "../repositories/stores.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateStoreBodyData,
	UpdateStoreBodyData,
} from "../validators/store.validators";

export class StoresService {
	async getAllStores() {
		return storesRepository.getAll();
	}

	async createNewStore(store: CreateStoreBodyData) {
		const storeExists = await storesRepository.storeNameExists(store.name);
		if (storeExists) {
			throw new ConflictError(
				"Store already exists",
				ErrorCodes.STORE_ALREADY_EXISTS
			);
		}
		const storeData: IStore = {
			name: store.name,
			locations: [],
			logo: store.logo,
			website_link: store.website_link,
			offers: [],
		};

		return storesRepository.add(storeData);
	}

	async updateStore(id: string, store: UpdateStoreBodyData) {
		const storeExists = await storesRepository.findById(id);

		if (!storeExists) {
			throw new NotFoundError("Store not found", ErrorCodes.STORE_NOT_FOUND);
		}
		if (store.name) {
			const storeDoc = await storesRepository.findByName(store.name);

			if (storeDoc && storeDoc._id?.toString() !== id) {
				throw new ConflictError(
					"Store with same name exists",
					ErrorCodes.STORE_ALREADY_EXISTS
				);
			}
		}
		const patchData = removeUndefinedValuesFromObject<Partial<IStore>>({
			name: store.name,
			locations: store.locations,
			logo: store.logo,
			website_link: store.website_link,
			offers: store.offers?.map((offer) => new ObjectId(offer)),
		});

		storesRepository.update(id, patchData);
	}

	async getStore(id: string) {
		const store = await storesRepository.findById(id);
		if (!store || store.length === 0) {
			throw new NotFoundError("Store not found", ErrorCodes.STORE_NOT_FOUND);
		}
		return store;
	}
}

export const storesService = new StoresService();
