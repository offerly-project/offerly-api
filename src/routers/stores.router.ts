import { Router } from "express";
import { storesController } from "../controllers/stores.controller";
import { validateRequest } from "../utils/utils";
import { createStoreSchema } from "../validators/store.validators";

// NON-MVP CODE
export const storesRouter = Router();

storesRouter.post(
	"/",
	validateRequest(createStoreSchema),
	storesController.createStoreHandler
);

storesRouter.get("/", storesController.getAllStoresHandler);

storesRouter.get("/:id", storesController.getStoreHandler);

storesRouter.patch("/:id", storesController.updateStoreHandler);
