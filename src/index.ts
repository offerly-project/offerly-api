import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import morgan from "morgan";
import { env } from "./configs/env";
import { errorsMiddleware } from "./middlewares/errors.middleware";
import { authRouter } from "./routers/auth.router";

dotenv.config();

const app = express();

app.use(json());

app.use(morgan("common"));

app.use(cors());

app.use("/auth", authRouter);

app.use(errorsMiddleware);

app.listen(env.PORT, () => {
	console.log(`Server is running on port ${env.PORT}`);
});
