import { Router } from "express";
import { staticController } from "../controllers/static.controller";

export const staticRouter = Router();

staticRouter.get("/countries", staticController.getCountriesHandler);

staticRouter.get("/categories", staticController.getCategoriesHandler);
