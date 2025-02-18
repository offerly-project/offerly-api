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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = exports.MailService = void 0;
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = require("nodemailer");
const path_1 = __importDefault(require("path"));
const env_1 = require("../configs/env");
class MailService {
    constructor() {
        this.sendOtpMail = (email_1, name_1, otp_1, ...args_1) => __awaiter(this, [email_1, name_1, otp_1, ...args_1], void 0, function* (email, name, otp, lang = "en") {
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, `../templates/otp/otp_${lang}.ejs`), { otp, name });
            this._sendMail(email, "OTP", html);
        });
        this.sendWelcomeMail = (email_1, name_1, ...args_1) => __awaiter(this, [email_1, name_1, ...args_1], void 0, function* (email, name, lang = "en") {
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, `../templates/welcome/welcome_${lang}.ejs`), { name });
            this._sendMail(email, "Welcome to our platform", html);
        });
        this.sendContactMail = (email, full_name, subject, message) => __awaiter(this, void 0, void 0, function* () {
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../templates/contact.ejs"), { subject, message, full_name, email });
            this._sendMail(env_1.env.SMTP_USER, `A Message from : ${email}`, html);
        });
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
    _sendMail(to, subject, html) {
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
