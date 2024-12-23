import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { usersRepository } from "../repositories/users.repository";
import { otpService } from "../services/otp.service";
import { generateToken } from "../utils/utils";
import { OTPVerificationBody } from "../validators/otp.validators";

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
		const otpValid = await otpService.verifyOtp(email, otp);

		if (!otpValid) {
			throw new BadRequestError("Invalid OTP");
		}

		const document = await usersRepository.findByEmail(email);

		if (!document) {
			throw new NotFoundError("User not found");
		}

		const token = await generateToken(document?._id.toString(), "user", {
			expiresIn: "5m",
		});

		res.status(StatusCodes.OK).json({ message: "OTP verified", token });
	} catch (e) {
		next(e);
	}
};

export const otpController = { verifyUserOtpHandler };
