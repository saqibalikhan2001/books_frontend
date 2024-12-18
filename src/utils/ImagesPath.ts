const IMS_BASE_URL = `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/`;
const BOOKS_BASE_URL = `${import.meta.env.VITE_AWS_S3_BOOKS_BUCKET_URL}/`;
export const ImagePath = (url: string, platform?: string) =>
  platform === "ims" || platform === "ims,books" || platform === "ims,books_deleted"
    ? `${IMS_BASE_URL}${url}`
    : `${BOOKS_BASE_URL}${url}`;
