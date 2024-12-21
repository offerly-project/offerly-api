"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStoreSchema = exports.createStoreSchema = void 0;
const zod_1 = require("zod");
// NON-MVP CODE
exports.createStoreSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: "Store Name is required" }),
        logo: zod_1.z.string({ message: "Store Logo is required" }),
        locations: zod_1.z.array(zod_1.z.string({ message: "Store Location is required" })),
        website_link: zod_1.z.string({ message: "Store Website Link is required" }),
    }),
});
exports.updateStoreSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        locations: zod_1.z.array(zod_1.z.string()).optional(),
        website_link: zod_1.z.string().optional(),
        offers: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
