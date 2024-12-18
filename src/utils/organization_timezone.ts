import timezone from "moment-timezone";
import moment from "moment";

export function getDashboardUpdatesTime(time: timezone.MomentInput) {
  return moment(time, "hh:mm:ss").format("hh:mm A");
}

export function getTimeWithSeconds(time: timezone.MomentInput) {
  return moment(time).format("hh:mm:ss A");
}

export function getTimeWithoutSeconds(time: timezone.MomentInput) {
  return moment(time).format("hh:mm A");
}

export function getDateWithFullYear(time: timezone.MomentInput) {
  return moment(time).format(`MMM DD, YYYY`);
}

export function getTimeinMinutes(time: timezone.DurationInputArg1) {
  let convertTime = moment.duration(time).asMinutes();
  convertTime = Math.ceil(convertTime);
  return convertTime === 1 ? convertTime + " Minute" : convertTime + " Minutes";
}
