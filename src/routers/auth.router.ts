import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../utils/utils";
import {
	adminLoginSchema,
	userForgotPasswordSchema,
	userLoginSchema,
} from "../validators/auth.validators";

export const authRouter = Router();

const adminRouter = Router();

const userRouter = Router();

authRouter.use("/admin", adminRouter);

authRouter.use("/user", userRouter);

adminRouter.post(
	"/login",
	validateRequest(adminLoginSchema),
	authController.adminLoginHandler
);

userRouter.post(
	"/login",
	validateRequest(userLoginSchema),
	authController.userLoginHandler
);

userRouter.post(
	"/forgot-password",
	validateRequest(userForgotPasswordSchema),
	authController.userForgotPasswordHandler
);
