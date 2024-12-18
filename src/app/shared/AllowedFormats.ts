export const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
export const attachementAllowedFormats = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_FILE_SIZE_USER_BUSINESS = 1 * 1024 * 1024;
export const attachmentTypeToastMessage =
  "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG, .DOC, CSV, and, .PDF";
