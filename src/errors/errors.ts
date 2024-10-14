import { ZodError } from "zod";

export class CustomError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
	toString() {
		return {
			status: this.status,
			message: this.message,
		};
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class UnauthorizedError extends CustomError {
	constructor(message: string) {
		super(message, 401);
	}
}

export class ZodFriendlyError extends CustomError {
	error: ZodError;
	constructor(zodError: ZodError) {
		super("invalid request", 400);
		this.error = zodError;
	}
	toString() {
		return {
			status: this.status,
			message: this.message,
			errors: Object.fromEntries(
				this.error.errors.map((err) => [err.path.join("."), err.message])
			),
		};
	}
}
