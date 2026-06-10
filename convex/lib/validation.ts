import { ConvexError } from "convex/values";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function utcDateString(date = new Date()) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function assertDateString(value: string) {
  if (!DATE_PATTERN.test(value)) {
    throw new ConvexError("Date must use YYYY-MM-DD format");
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || utcDateString(parsed) !== value) {
    throw new ConvexError("Invalid date");
  }
}

export function cleanText(value: string, field: string, maxLength: number) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned) throw new ConvexError(`${field} cannot be empty`);
  if (cleaned.length > maxLength) {
    throw new ConvexError(`${field} must be ${maxLength} characters or less`);
  }
  return cleaned;
}

export function cleanOptionalText(
  value: string | undefined,
  field: string,
  maxLength: number,
) {
  if (value === undefined) return undefined;
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned) return undefined;
  if (cleaned.length > maxLength) {
    throw new ConvexError(`${field} must be ${maxLength} characters or less`);
  }
  return cleaned;
}
