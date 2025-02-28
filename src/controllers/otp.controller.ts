import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { usersRepository } from "../repositories/users.repository";
import { mailService } from "../services/mail.service";
import { otpService } from "../services/otp.service";
import { generateToken } from "../utils/utils";
import {
	OTPGenerationBody,
	OTPVerificationBody,
} from "../validators/otp.validators";

const verifyUserOtpHandler = async (
	req: Request<{}, {}, OTPVerificationBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { otp, email } = req.body;

		const userHasOtp = otpService.hasOtp(email);

		if (!userHasOtp) {
			throw new NotFoundError("OTP not found", ErrorCodes.OTP_NOT_FOUND);
		}
		const otpData = otpService.getOtp(email);

		const otpValid = await otpService.verifyOtp(email, otp);

		if (!otpValid) {
			throw new BadRequestError("Invalid OTP", ErrorCodes.INVALID_OTP);
		}

		const document = await usersRepository.findByEmail(email);

		if (!document) {
			throw new NotFoundError("User not found", ErrorCodes.NOT_FOUND);
		}

		const token = await generateToken(
			document?._id.toString(),
			"user",
			otpData.source,
			{
				expiresIn: "5m",
			}
		);

		res.status(StatusCodes.OK).json({ message: "OTP verified", token });
	} catch (e) {
		next(e);
	}
};

const generateUserOtpHandler = async (
	req: Request<{}, {}, OTPGenerationBody>,
	res: Response,
	next: NextFunction
) => {
	let { email, source } = req.body;
	email = email.toLowerCase();
	try {
		if (source === "login") {
			throw new UnauthorizedError(
				"Can't generate OTP of this type",
				ErrorCodes.UNAUTHORIZED
			);
		}
		const otp = await otpService.requestOtp(email, source);
		const user = await usersRepository.findByEmail(email);

		if (!user) {
			throw new NotFoundError("User not found", ErrorCodes.NOT_FOUND);
		}
		mailService.sendOtpMail(
			email,
			user?.full_name,
			otp.code,
			user.language || "en"
		);
		res.status(StatusCodes.OK).send({
			status: StatusCodes.OK,
			message: "OTP sent to your email",
			expiry: otp.expiry,
		});
	} catch (e) {
		next(e);
	}
};

export const otpController = { verifyUserOtpHandler, generateUserOtpHandler };
