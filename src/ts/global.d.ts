import { JwtPayload } from "jsonwebtoken";
import { JWTSource } from "../utils/utils";

export type UserRole = "admin" | "user" | "guest";

export type EntityStatus = "enabled" | "disabled";

export type JwtUserPayload = {
	id: string;
	role: UserRole;
	source: JWTSource;
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
