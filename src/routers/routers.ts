import { Router } from "express";
import { authorizeAdmin } from "../middlewares/auth.middleware";
import { adminAuthRouter, userAuthRouter } from "./auth.router";
import { banksRouter } from "./banks.router";
import { cardsRouter } from "./cards.router";
import { offersRouter } from "./offers.router";
import { otpRouter } from "./otp.router";
import { storesRouter } from "./stores.router";
import { usersRouter } from "./users.router";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);

adminRouter.use("/users", authorizeAdmin, usersRouter);

adminRouter.use("/banks", authorizeAdmin, banksRouter);

adminRouter.use("/cards", authorizeAdmin, cardsRouter);

adminRouter.use("/stores", authorizeAdmin, storesRouter);

adminRouter.use("/offers", authorizeAdmin, offersRouter);

export const userRouter = Router();

userRouter.use("/auth", userAuthRouter);

userRouter.use("/otp", otpRouter);
