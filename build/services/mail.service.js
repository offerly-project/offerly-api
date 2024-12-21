"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = exports.MailService = void 0;
const nodemailer_1 = require("nodemailer");
const env_1 = require("../configs/env");
class MailService {
    constructor() {
        this._transporter = (0, nodemailer_1.createTransport)({
            service: env_1.env.SMTP_SERVICE,
            host: env_1.env.SMTP_HOST,
            port: parseInt(env_1.env.SMTP_PORT),
            secure: env_1.env.SMTP_SECURE === "true",
            auth: {
                user: env_1.env.SMTP_USER,
                pass: env_1.env.SMTP_PASS,
            },
        });
    }
    sendMail(to, subject, html) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._transporter.sendMail({
                from: env_1.env.SMTP_USER,
                to,
                subject,
                html,
            });
        });
    }
}
exports.MailService = MailService;
exports.mailService = new MailService();
