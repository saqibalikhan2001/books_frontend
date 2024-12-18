/** @format */

import {
  addDays,
  endOfDay,
  addYears,
  addMonths,
  endOfWeek,
  endOfYear,
  startOfDay,
  endOfMonth,
  startOfWeek,
  startOfYear,
  startOfMonth,
} from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

export const useTimeZone = (timezone: string) => {
  const getCurrentTimeZone = () => dayjs.tz(new Date(), timezone).format("YYYY-MM-DD HH:mm:ss");
  const customRanges = (startDate: number | Date) => ({
    endOfWeek: endOfWeek(startDate),
    endOfToday: endOfDay(startDate),
    endOfYear: endOfYear(startDate),
    endOfMonth: endOfMonth(startDate),
    startOfWeek: startOfWeek(startDate),
    startOfToday: startOfDay(startDate),
    startOfYear: startOfYear(startDate),
    startOfMonth: startOfMonth(startDate),
    endOfLastWeek: endOfWeek(addDays(startDate, -7)),
    endOfYesterday: endOfDay(addDays(startDate, -1)),
    endOfLastYear: endOfYear(addYears(startDate, -1)),
    endOfNextMonth: endOfMonth(addMonths(startDate, 1)),
    startOfLastWeek: startOfWeek(addDays(startDate, -7)),
    startOfYesterday: startOfDay(addDays(startDate, -1)),
    endOfLastMonth: endOfMonth(addMonths(startDate, -1)),
    startOfLastYear: startOfYear(addYears(startDate, -1)),
    startOfLastMonth: startOfMonth(addMonths(startDate, -1)),
  });

  const handleDate = (value: string, date: Date | number): Dayjs | undefined => {
    const newDate = new Date(date);
    let instance;
    switch (value) {
      case "custom":
        break;
      case "this month":
        instance = dayjs(customRanges(newDate).endOfMonth);
        break;
      case "next month":
        instance = dayjs(customRanges(newDate).endOfNextMonth);
        break;
      case "receipt":
        instance = dayjs(customRanges(newDate).endOfToday);
        break;
      default:
        instance = dayjs(addDays(newDate, +value));
    }
    return instance;
  };

  const dateWithOrgTZ = (date: any) => {
    return dayjs.tz(date, timezone);
  };

  return { getCurrentTimeZone, customRanges, handleDate, dateWithOrgTZ };
};
