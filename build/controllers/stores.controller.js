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
exports.storesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const stores_service_1 = require("../services/stores.service");
const utils_1 = require("../utils/utils");
// NON-MVP CODE
const createStoreHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id = yield stores_service_1.storesService.createNewStore(body);
        res.status(http_status_codes_1.StatusCodes.OK).send({ id });
    }
    catch (e) {
        next(e);
    }
});
const getAllStoresHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield stores_service_1.storesService.getAllStores();
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(stores));
    }
    catch (e) {
        next(e);
    }
});
const getStoreHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const store = yield stores_service_1.storesService.getStore(id);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(store));
    }
    catch (e) {
        next(e);
    }
});
const updateStoreHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const body = req.body;
        yield stores_service_1.storesService.updateStore(id, body);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ message: "Store details updated successfully" });
    }
    catch (e) {
        next(e);
    }
});
exports.storesController = {
    createStoreHandler,
    getAllStoresHandler,
    getStoreHandler,
    updateStoreHandler,
};
