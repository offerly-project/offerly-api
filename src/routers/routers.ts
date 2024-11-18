import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authorizeAdmin } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import { signupUserSchema } from "../validators/users.validators";
import { adminAuthRouter, userAuthRouter } from "./auth.router";
import { banksRouter } from "./banks.router";
import { cardsRouter } from "./cards.router";
import { offersRouter } from "./offers.router";
import { storesRouter } from "./stores.router";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);

adminRouter.use("/banks", authorizeAdmin, banksRouter);

adminRouter.use("/cards", authorizeAdmin, cardsRouter);

adminRouter.use("/stores", authorizeAdmin, storesRouter);

adminRouter.use("/offers", authorizeAdmin, offersRouter);

export const userRouter = Router();

userRouter.use("/auth", userAuthRouter);

userRouter.post(
	"/signup",
	validateRequest(signupUserSchema),
	usersController.createUserHandler
);
