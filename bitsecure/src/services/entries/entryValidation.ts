import type {
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../../models/passwordEntry";

export function validatePasswordEntry(
  entryDraft: PasswordEntryInput,
): PasswordEntryValidationErrors {
  const nextErrors: PasswordEntryValidationErrors = {};

  if (!entryDraft.title.trim()) {
    nextErrors.title = "Title is required.";
  }

  if (!entryDraft.username.trim()) {
    nextErrors.username = "Username is required.";
  }

  if (!entryDraft.password.trim()) {
    nextErrors.password = "Password is required.";
  }

  if (entryDraft.url.trim()) {
    try {
      new URL(entryDraft.url);
    } catch {
      nextErrors.url = "URL must be valid.";
    }
  }

  return nextErrors;
}
