import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { adminsRepository } from "../repositories/admins.repository";
import { usersRepository } from "../repositories/users.repository";
import { authService } from "../services/auth.service";
import { otpService } from "../services/otp.service";
import { OTPVerificationBody } from "../validators/otp.validators";

const verifyOtpHandler = async (
	req: Request<{}, {}, OTPVerificationBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { otp, email, role } = req.body;
		const userHasOtp = otpService.doesUserHaveOtp(email);

		if (!userHasOtp) {
			throw new NotFoundError("OTP not found");
		}
		const otpValid = otpService.verifyOtp(email, otp);
		console.log(otpValid);

		if (!otpValid) {
			throw new BadRequestError("Invalid OTP");
		}

		const document =
			role === "admin"
				? await adminsRepository.findOneByUsername(email)
				: await usersRepository.findByEmail(email);

		if (!document) {
			throw new NotFoundError("User not found");
		}

		const token = await authService.generateToken(
			document?._id.toString(),
			role,
			{
				expiresIn: "2m",
			}
		);

		res.status(StatusCodes.OK).json({ message: "OTP verified", token });
	} catch (e) {
		next(e);
	}
};

export const otpController = { verifyOtpHandler };
