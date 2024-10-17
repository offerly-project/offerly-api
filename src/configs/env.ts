import dotenv from "dotenv";
import z from "zod";
dotenv.config();

const schema = z.object({
	PORT: z.string().default("8080"),
	DB_URL: z.string(),
	DB_NAME: z.string(),
	SALT_ROUNDS: z.string().default("10"),
	PRIVATE_KEY: z.string(),
	DATA_DIR: z.string(),
});

export const env = schema.parse(process.env);
