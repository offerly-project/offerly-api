import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../utils/utils";
import {
	adminLoginSchema,
	userLoginSchema,
} from "../validators/auth.validators";

export const authRouter = Router();

authRouter.post(
	"/login/admin",
	validateRequest(adminLoginSchema),
	authController.adminLoginHandler
);

authRouter.post(
	"/login/user",
	validateRequest(userLoginSchema),
	authController.userLoginHandler
);
