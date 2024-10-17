import { Router } from "express";
import { banksController } from "../controllers/banks.controller";

export const banksRouter = Router();

banksRouter.post("/", banksController.createBankHandler);
