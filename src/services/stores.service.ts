import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { IStore } from "../models/store.model";
import { storesRepository } from "../repositories/stores.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateStoreBodyData,
	UpdateStoreBodyData,
} from "../validators/store.validators";

export class StoresService {
	constructor() {}

	async getAllStores() {
		return storesRepository.getAll();
	}

	async createNewStore(store: CreateStoreBodyData) {
		const storeExists = await storesRepository.storeNameExists(store.name);
		if (storeExists) {
			throw new BadRequestError("Store already exists");
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
			throw new NotFoundError("Store not found");
		}
		if (store.name) {
			const storeDoc = await storesRepository.findByName(store.name);

			if (storeDoc && storeDoc._id?.toString() !== id) {
				throw new NotFoundError("Store with same name exists");
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
		if (!store) {
			throw new NotFoundError("Store not found");
		}
		return store;
	}
}

export const storesService = new StoresService();
