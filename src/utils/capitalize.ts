export function capitalize(str?: string | null) {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
}
