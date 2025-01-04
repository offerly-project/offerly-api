import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authorizeAdmin, authorizeUser } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import { signupUserSchema } from "../validators/user.validators";
import { adminAuthRouter, userAuthRouter } from "./auth.router";
import { banksAdminRouter, banksUserRouter } from "./banks.router";
import { cardsAdminRouter, cardsUserRouter } from "./cards.router";
import { userFavoriteOffersRouter } from "./favorites.router";
import { guestRouter } from "./guest.router";
import { offersAdminRouter, offersUserRouter } from "./offers.router";
import { userAdminRouter, userUserRouter } from "./user.router";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);

adminRouter.use("/banks", authorizeAdmin, banksAdminRouter);

adminRouter.use("/cards", authorizeAdmin, cardsAdminRouter);

adminRouter.use("/offers", authorizeAdmin, offersAdminRouter);

adminRouter.use("/user", authorizeAdmin, userAdminRouter);

export const userRouter = Router();

userRouter.use("/auth", userAuthRouter);

userRouter.use("/banks", authorizeUser, banksUserRouter);

userRouter.use("/cards", authorizeUser, cardsUserRouter);

userRouter.use("/offers", authorizeUser, offersUserRouter);

userRouter.use("/favorites", authorizeUser, userFavoriteOffersRouter);

userRouter.use("/user", authorizeUser, userUserRouter);

userRouter.use("/guest", guestRouter);

userRouter.post(
	"/signup",
	validateRequest(signupUserSchema),
	userController.createUserHandler
);
