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
	SMTP_HOST: z.string(),
	SMTP_SERVICE: z.string(),
	SMTP_PORT: z.string(),
	SMTP_USER: z.string(),
	SMTP_PASS: z.string(),
	SMTP_SECURE: z.string(),
});

export const env = schema.parse(process.env);
