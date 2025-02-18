"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticRouter = void 0;
const express_1 = require("express");
const static_controller_1 = require("../controllers/static.controller");
exports.staticRouter = (0, express_1.Router)();
exports.staticRouter.get("/countries", static_controller_1.staticController.getCountriesHandler);
exports.staticRouter.get("/languages", static_controller_1.staticController.getLanguagesHandler);
exports.staticRouter.get("/categories", static_controller_1.staticController.getCategoriesHandler);
