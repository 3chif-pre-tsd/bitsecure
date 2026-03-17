import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../../models/passwordEntry";

function normalizeComparisonValue(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function validatePasswordEntry(
  entryDraft: PasswordEntryInput,
  entries: PasswordEntry[] = [],
  editingEntryId: string | null = null,
): PasswordEntryValidationErrors {
  const nextErrors: PasswordEntryValidationErrors = {};
  const normalizedTitle = normalizeComparisonValue(entryDraft.title);
  const normalizedUsername = normalizeComparisonValue(entryDraft.username);

  if (!normalizedTitle) {
    nextErrors.title = "Title is required.";
  }

  if (!normalizedUsername) {
    nextErrors.username = "Username is required.";
  }

  if (!entryDraft.password.trim()) {
    nextErrors.password = "Password is required.";
  }

  if (entryDraft.password.trim() && entryDraft.password.length < 4) {
    nextErrors.password = "Password must be at least 4 characters long.";
  }

  if (entryDraft.url.trim()) {
    try {
      new URL(entryDraft.url);
    } catch {
      nextErrors.url = "URL must be valid.";
    }
  }

  const hasDuplicate = entries.some(
    (entry) =>
      entry.id !== editingEntryId &&
      normalizeComparisonValue(entry.title) === normalizedTitle &&
      normalizeComparisonValue(entry.username) === normalizedUsername,
  );

  if (hasDuplicate) {
    nextErrors.form = "An entry with the same title and username already exists.";
  }

  return nextErrors;
}
