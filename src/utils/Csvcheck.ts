export function isCsvOrExcelFile(input: string | undefined): boolean {
  // Define valid extensions for CSV and Excel files
  const validExtensions = [
    "csv",
    "tsv",
    "psv",
    "dsv",
    "xlsx",
    "xlsm",
    "xls",
    "xlsb",
    "xltx",
    "xltm",
    "xml",
    "xlam",
  ];

  // Define valid MIME types for CSV and Excel files
  const validMimeTypes = [
    "text/csv", // CSV MIME type
    "application/vnd.ms-excel", // Older Excel format
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx MIME type
    "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm MIME type
    "application/vnd.ms-excel.template.macroEnabled.12", // .xltm MIME type
    "application/vnd.ms-excel.addin.macroEnabled.12", // .xlam MIME type
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12", // .xlsb MIME type
  ];

  // Check if input is provided and if it matches an extension or MIME type
  if (typeof input === "string") {
    const isExtensionMatch = validExtensions.some((extension) =>
      input.toLowerCase().endsWith(extension)
    );
    const isMimeTypeMatch = validMimeTypes.includes(input.toLowerCase());

    return isExtensionMatch || isMimeTypeMatch;
  }

  // Return false if input is undefined or not a string
  return false;
}
