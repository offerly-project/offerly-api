"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = __importDefault(require("zod"));
dotenv_1.default.config();
const schema = zod_1.default.object({
    PORT: zod_1.default.string().default("8080"),
    DB_URL: zod_1.default.string(),
    SALT_ROUNDS: zod_1.default.string().default("10"),
    PRIVATE_KEY: zod_1.default.string(),
    DATA_DIR: zod_1.default.string(),
    SMTP_HOST: zod_1.default.string(),
    SMTP_SERVICE: zod_1.default.string(),
    SMTP_PORT: zod_1.default.string(),
    SMTP_USER: zod_1.default.string(),
    SMTP_PASS: zod_1.default.string(),
    SMTP_SECURE: zod_1.default.string(),
    NODE_ENV: zod_1.default.string().default("development"),
    UPLOADS_DIR: zod_1.default.string(),
    AGENDA_URL: zod_1.default.string(),
});
exports.env = schema.parse(process.env);
