import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { loginSchema } from "../schemas/auth.schemas";
import { validateRequest } from "../utils/utils";

export const authRouter = Router();

authRouter.post(
	"/login/:type",
	validateRequest(loginSchema),
	authController.loginHandler
);
