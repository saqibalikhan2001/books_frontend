export default function getDateFormat(date) {
  let currentOrganization = date ? date : null;

  // const dateFormat =
  //   date === null
  //     ? currentOrganization
  //       ? JSON.parse(currentOrganization).date_formate
  //       : false
  //     : date;
  const dateSeparator = currentOrganization ? currentOrganization?.date_separator : true;
  switch (currentOrganization?.date_format) {
    case "short1":
      return `MM${dateSeparator}DD${dateSeparator}YY`;
    case "short2":
      return `DD${dateSeparator}MM${dateSeparator}YY`;
    case "short3":
      return `YY${dateSeparator}MM${dateSeparator}DD`;
    case "medium1":
      return `MM${dateSeparator}DD${dateSeparator}YYYY`;
    case "medium2":
      return `DD${dateSeparator}MM${dateSeparator}YYYY`;
    case "medium3":
      return `YYYY${dateSeparator}MM${dateSeparator}DD`;
    case "long5":
      return `dddd, MMMM DD, YYYY`;
    case "long4":
      return `ddd, MMMM DD, YYYY`;
    case "long3":
      return `MMMM DD,YYYY`;
    case "long2":
      return `DD MMMM YYYY`;
    case "long1":
      return `DD MMM YYYY`;
    case "long6":
      return `MMM DD, YY`;
    default:
      //return `MM/DD/YYYY`
      return `MMM DD, YY`;
  }
}
