"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const db_1 = require("./configs/db");
const env_1 = require("./configs/env");
const options_1 = require("./configs/options");
const errors_middleware_1 = require("./middlewares/errors.middleware");
const otp_router_1 = require("./routers/otp.router");
const routers_1 = require("./routers/routers");
const uploads_router_1 = require("./routers/uploads.router");
const swagger_json_1 = __importDefault(require("./swagger.json"));
dotenv_1.default.config();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.db.connect();
        const app = (0, express_1.default)();
        app.use((0, morgan_1.default)("common"));
        app.use((0, express_1.urlencoded)({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, express_1.json)());
        app.use((0, cors_1.default)(options_1.CORS_OPTIONS));
        app.use("/uploads", uploads_router_1.uploadsRouter);
        app.use("/otp", otp_router_1.otpRouter);
        app.use("/admin", routers_1.adminRouter);
        app.use("/user", routers_1.userRouter);
        if (env_1.env.NODE_ENV === "development") {
            app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        }
        app.get("/health", (req, res) => {
            res.json({ status: "healthy!" });
        });
        console.log(env_1.env.DATA_DIR);
        console.log(env_1.env.UPLOADS_DIR);
        app.use("/uploads", express_1.default.static(env_1.env.UPLOADS_DIR));
        app.use("/static", express_1.default.static(env_1.env.DATA_DIR));
        app.use(errors_middleware_1.errorsMiddleware);
        app.listen(env_1.env.PORT, () => {
            console.log(`Server is running on port ${env_1.env.PORT}`);
        });
    });
})();
