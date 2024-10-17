import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../utils/utils";
import { adminLoginSchema } from "../validators/auth.validators";

export const authRouter = Router();

authRouter.post(
	"/login/admin",
	validateRequest(adminLoginSchema),
	authController.adminLoginHandler
);
