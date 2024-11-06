import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../utils/utils";
import {
	adminLoginSchema,
	userForgotPasswordSchema,
	userLoginSchema,
	userResetPasswordSchema,
} from "../validators/auth.validators";

export const adminAuthRouter = Router();

adminAuthRouter.post(
	"/login",
	validateRequest(adminLoginSchema),
	authController.adminLoginHandler
);

export const userAuthRouter = Router();

userAuthRouter.post(
	"/login",
	validateRequest(userLoginSchema),
	authController.userLoginHandler
);

userAuthRouter.post(
	"/forgot-password",
	validateRequest(userForgotPasswordSchema),
	authController.userForgotPasswordHandler
);

userAuthRouter.put(
	"/reset-password",
	validateRequest(userResetPasswordSchema),
	authController.userResetPasswordHandler
);
