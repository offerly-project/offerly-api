import { z } from "zod";

export const adminLoginSchema = z.object({
	body: z.object({
		username: z.string({ message: "Username is required" }),
		password: z.string({ message: "Password is required" }),
	}),
});

export type AdminLoginBodyData = z.infer<typeof adminLoginSchema>["body"];
