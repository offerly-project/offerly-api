export const UPLOAD_DIRECTORIES = ["/banks", "/offers", "/cards"] as const;

export type UploadDirectory = (typeof UPLOAD_DIRECTORIES)[number];
