import dayjs from "dayjs";
const dahsed_format = "YYYY-MM-DD";
const Data_Time_Format = "YYYY-MM-DD HH:mm:ss";

export const getFullDate = (date?: string): string | null =>
  date ? dayjs(date).format(dahsed_format) : "";

export const getFullDateAndTime = (date: string): string | null =>
  date ? dayjs(date).format(Data_Time_Format) : null;

export const getOrganizationDate = (date?: string, org_format?: string): string | null =>
  date ? dayjs(date).format(org_format) : null;
