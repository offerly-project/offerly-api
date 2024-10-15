import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { adminLoginSchema } from "../schemas/auth.schemas";
import { validateRequest } from "../utils/utils";

export const authRouter = Router();

authRouter.post(
	"/login/admin",
	validateRequest(adminLoginSchema),
	authController.adminLoginHandler
);
