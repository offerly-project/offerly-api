import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/errors";
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
			throw new NotFoundError("OTP not found");
		}
		const otpData = otpService.getOtp(email);

		const otpValid = await otpService.verifyOtp(email, otp);

		if (!otpValid) {
			throw new BadRequestError("Invalid OTP");
		}

		const document = await usersRepository.findByEmail(email);

		if (!document) {
			throw new NotFoundError("User not found");
		}

		const token = await generateToken(
			document?._id.toString(),
			"user",
			otpData.permissions,
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
	const { email, permissions } = req.body;
	try {
		if (permissions.includes("all")) {
			throw new BadRequestError("Can't generate OTP for all permissions");
		}
		const otp = await otpService.requestOtp(email, permissions);
		mailService.sendOtpMail(email, otp.code);
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
