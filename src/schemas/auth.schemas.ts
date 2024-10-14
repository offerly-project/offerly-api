import { z } from "zod";

export const loginSchema = z.object({
	params: z.object({
		type: z.enum(["admin", "client"], {
			message: "Type must be either admin or client",
		}),
	}),
	body: z.object({
		username: z.string({ message: "Username is required" }),
		password: z.string({ message: "Password is required" }),
	}),
});
