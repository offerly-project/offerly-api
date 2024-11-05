import { createTransport, Transporter } from "nodemailer";
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

	async sendMail(to: string, subject: string, html: string) {
		return this._transporter.sendMail({
			from: env.SMTP_USER,
			to,
			subject,
			html,
		});
	}
}

export const mailService = new MailService();
