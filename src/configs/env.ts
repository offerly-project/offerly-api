import dotenv from "dotenv";
import z from "zod";
dotenv.config();

const schema = z.object({
	PORT: z.string().default("8080"),
});

export const env = schema.parse(process.env);
