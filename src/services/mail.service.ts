import ejs from "ejs";
import { createTransport, Transporter } from "nodemailer";
import path from "path";
import { env } from "../configs/env";
import { Language } from "../models/user.model";

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

	sendOtpMail = async (
		email: string,
		name: string,
		otp: string,
		lang: Language = "en"
	) => {
		const html = await ejs.renderFile(
			path.join(__dirname, `../templates/otp/otp_${lang}.ejs`),
			{ otp, name }
		);

		this._sendMail(email, "OTP", html);
	};

	sendWelcomeMail = async (
		email: string,
		name: string,
		lang: Language = "en"
	) => {
		const html = await ejs.renderFile(
			path.join(__dirname, `../templates/welcome/welcome_${lang}.ejs`),
			{ name }
		);
		this._sendMail(email, "Welcome to our platform", html);
	};

	sendContactMail = async (
		email: string,
		full_name: string,
		subject: string,
		message: string
	) => {
		const html = await ejs.renderFile(
			path.join(__dirname, "../templates/contact.ejs"),
			{ subject, message, full_name, email }
		);
		this._sendMail(env.SMTP_USER, `A Message from : ${email}`, html);
	};
}

export const mailService = new MailService();
