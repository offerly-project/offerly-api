import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { authController } from "../controllers/auth.controller";
import { authorizeAdmin, authorizeUser } from "../middlewares/auth.middleware";
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

adminAuthRouter.get("/", authorizeAdmin, (req, res) => {
	res.status(StatusCodes.OK).send();
});

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
	authorizeUser,
	validateRequest(userResetPasswordSchema),
	authController.userResetPasswordHandler
);

adminAuthRouter.get("/", authorizeUser, (req, res) => {
	res.status(StatusCodes.OK).send();
});
