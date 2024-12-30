import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authorizeUserWithActions } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import {
	adminLoginSchema,
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

userAuthRouter.put(
	"/reset-password",
	authorizeUserWithActions(["password-reset", "all"]),
	validateRequest(userResetPasswordSchema),
	authController.userResetPasswordHandler
);
