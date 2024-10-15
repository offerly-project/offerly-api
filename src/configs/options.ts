import { CorsOptions } from "cors";
import { CookieOptions } from "express";

export const COOKIE_OPTIONS: CookieOptions = {
	maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
	httpOnly: true,
};

export const CORS_OPTIONS: CorsOptions = {
	credentials: true,
};
