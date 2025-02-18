"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagingInstance = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebase_svc_acc_json_1 = __importDefault(require("../../firebase-svc-acc.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebase_svc_acc_json_1.default),
});
exports.messagingInstance = firebase_admin_1.default.messaging();
