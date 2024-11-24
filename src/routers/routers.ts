import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authorizeAdmin } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import { signupUserSchema } from "../validators/users.validators";
import { adminAuthRouter, userAuthRouter } from "./auth.router";
import { banksAdminRouter, banksUserRouter } from "./banks.router";
import { cardsAdminRouter, cardsUserRouter } from "./cards.router";
import { offersAdminRouter, offersUserRouter } from "./offers.router";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);

adminRouter.use("/banks", authorizeAdmin, banksAdminRouter);

adminRouter.use("/cards", authorizeAdmin, cardsAdminRouter);

adminRouter.use("/offers", authorizeAdmin, offersAdminRouter);

export const userRouter = Router();

userRouter.use("/auth", userAuthRouter);

userRouter.use("/banks", banksUserRouter);

userRouter.use("/cards", cardsUserRouter);

userRouter.use("/offers", offersUserRouter);

userRouter.post(
	"/signup",
	validateRequest(signupUserSchema),
	usersController.createUserHandler
);
