import { CorsOptions } from "cors";

export const CORS_OPTIONS: CorsOptions = {
	credentials: true,
	origin: ["http://localhost:3000", "http://localhost:8080"],
};
