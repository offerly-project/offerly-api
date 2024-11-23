import { JwtPayload } from "jsonwebtoken";

export type UserRole = "admin" | "user";

export type EntityStatus = "enabled" | "disabled";

export type JwtUserPayload = {
	id: string;
	role: UserRole;
};

export type TokenPayload = JwtPayload & JwtUserPayload;

declare module "express-serve-static-core" {
	interface Request {
		user: JwtUserPayload;
	}
}

export type Translation = {
	en: string;
	ar: string;
};
