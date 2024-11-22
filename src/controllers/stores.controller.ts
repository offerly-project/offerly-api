import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { storesService } from "../services/stores.service";
import { transformDocsResponse } from "../utils/utils";
import {
	CreateStoreBodyData,
	UpdateStoreBodyData,
} from "../validators/store.validators";

// NON-MVP CODE

const createStoreHandler = async (
	req: Request<{}, {}, CreateStoreBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const body = req.body;
		const id = await storesService.createNewStore(body);
		res.status(StatusCodes.OK).send({ id });
	} catch (e) {
		next(e);
	}
};

const getAllStoresHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const stores = await storesService.getAllStores();
		res.status(StatusCodes.OK).send(transformDocsResponse(stores));
	} catch (e) {
		next(e);
	}
};

const getStoreHandler = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id;
		const store = await storesService.getStore(id);
		res.status(StatusCodes.OK).send(transformDocsResponse(store));
	} catch (e) {
		next(e);
	}
};

const updateStoreHandler = async (
	req: Request<{ id: string }, {}, UpdateStoreBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id;
		const body = req.body;
		await storesService.updateStore(id, body);
		res
			.status(StatusCodes.OK)
			.send({ message: "Store details updated successfully" });
	} catch (e) {
		next(e);
	}
};

export const storesController = {
	createStoreHandler,
	getAllStoresHandler,
	getStoreHandler,
	updateStoreHandler,
};
