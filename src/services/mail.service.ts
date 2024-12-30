import ejs from "ejs";
import { createTransport, Transporter } from "nodemailer";
import path from "path";
import { env } from "../configs/env";

export class MailService {
	private _transporter: Transporter;
	constructor() {
		this._transporter = createTransport({
			service: env.SMTP_SERVICE,
			host: env.SMTP_HOST,
			port: parseInt(env.SMTP_PORT),
			secure: env.SMTP_SECURE === "true",
			auth: {
				user: env.SMTP_USER,
				pass: env.SMTP_PASS,
			},
		});
	}

	private async _sendMail(to: string, subject: string, html: string) {
		return this._transporter.sendMail({
			from: env.SMTP_USER,
			to,
			subject,
			html,
		});
	}

	sendOtpMail = async (email: string, otp: string) => {
		const html = await ejs.renderFile(
			path.join(__dirname, "../templates/otp.ejs"),
			{ otp }
		);
		this._sendMail(email, "Password Reset OTP", html);
	};
}

export const mailService = new MailService();
