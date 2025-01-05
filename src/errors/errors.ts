import { ZodError } from "zod";
import { ErrorCodes } from "./errors.codes";

export class CustomError extends Error {
	status: number;
	code: ErrorCodes;
	constructor(message: string, status: number, code: ErrorCodes) {
		super(message);
		this.status = status;
		this.code = code;
	}
	toString() {
		return {
			status: this.status,
			message: this.message,
			code: this.code,
		};
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string, code = ErrorCodes.NOT_FOUND) {
		super(message, 404, code);
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string, code = ErrorCodes.BAD_REQUEST) {
		super(message, 400, code);
	}
}

export class InternalServerError extends CustomError {
	constructor(message: string, code = ErrorCodes.INTERNAL_SERVER_ERROR) {
		super(message, 500, code);
	}
}

export class UnauthorizedError extends CustomError {
	constructor(message: string, code = ErrorCodes.UNAUTHORIZED) {
		super(message, 401, code);
	}
}

export class ConflictError extends CustomError {
	constructor(message: string, code = ErrorCodes.CONFLICT) {
		super(message, 409, code);
	}
}

export class ZodFriendlyError extends CustomError {
	error: ZodError;
	constructor(zodError: ZodError, code = ErrorCodes.BAD_REQUEST) {
		super("invalid request", 400, code);
		this.error = zodError;
	}
	toString() {
		return {
			status: this.status,
			message: this.message,
			errors: Object.fromEntries(
				this.error.errors.map((err) => [err.path.join("."), err.message])
			),
			code: this.code,
		};
	}
}
