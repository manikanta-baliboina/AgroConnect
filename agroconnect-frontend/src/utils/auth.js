export function normalizeRole(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}
