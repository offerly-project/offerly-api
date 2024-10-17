import { Router } from "express";
import { imageUploadHandler } from "../controllers/upload.controller";

export const uploadsRouter = Router();

uploadsRouter.post("/images", imageUploadHandler);
