"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storesService = exports.StoresService = void 0;
const mongodb_1 = require("mongodb");
const errors_1 = require("../errors/errors");
const stores_repository_1 = require("../repositories/stores.repository");
const utils_1 = require("../utils/utils");
class StoresService {
    getAllStores() {
        return __awaiter(this, void 0, void 0, function* () {
            return stores_repository_1.storesRepository.getAll();
        });
    }
    createNewStore(store) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeExists = yield stores_repository_1.storesRepository.storeNameExists(store.name);
            if (storeExists) {
                throw new errors_1.ConflictError("Store already exists");
            }
            const storeData = {
                name: store.name,
                locations: [],
                logo: store.logo,
                website_link: store.website_link,
                offers: [],
            };
            return stores_repository_1.storesRepository.add(storeData);
        });
    }
    updateStore(id, store) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const storeExists = yield stores_repository_1.storesRepository.findById(id);
            if (!storeExists) {
                throw new errors_1.NotFoundError("Store not found");
            }
            if (store.name) {
                const storeDoc = yield stores_repository_1.storesRepository.findByName(store.name);
                if (storeDoc && ((_a = storeDoc._id) === null || _a === void 0 ? void 0 : _a.toString()) !== id) {
                    throw new errors_1.NotFoundError("Store with same name exists");
                }
            }
            const patchData = (0, utils_1.removeUndefinedValuesFromObject)({
                name: store.name,
                locations: store.locations,
                logo: store.logo,
                website_link: store.website_link,
                offers: (_b = store.offers) === null || _b === void 0 ? void 0 : _b.map((offer) => new mongodb_1.ObjectId(offer)),
            });
            stores_repository_1.storesRepository.update(id, patchData);
        });
    }
    getStore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield stores_repository_1.storesRepository.findById(id);
            if (!store || store.length === 0) {
                throw new errors_1.NotFoundError("Store not found");
            }
            return store;
        });
    }
}
exports.StoresService = StoresService;
exports.storesService = new StoresService();
