import { Router } from "express";
import { adminAuthRouter, userAuthRouter } from "./auth.router";
import { banksRouter } from "./banks.router";
import { cardsRouter } from "./cards.router";
import { offersRouter } from "./offers.router";
import { otpRouter } from "./otp.router";
import { storesRouter } from "./stores.router";
import { usersRouter } from "./users.router";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);

adminRouter.use("/users", usersRouter);

adminRouter.use("/banks", banksRouter);

adminRouter.use("/cards", cardsRouter);

adminRouter.use("/stores", storesRouter);

adminRouter.use("/offers", offersRouter);

export const userRouter = Router();

userRouter.use("/auth", userAuthRouter);

userRouter.use("/otp", otpRouter);
