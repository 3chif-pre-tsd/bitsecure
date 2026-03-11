import { ENTRY_STORAGE_KEY } from "../../constants/auth";
import type { PasswordEntry, PasswordEntryInput } from "../../models/passwordEntry";
import { readFromStorage, writeToStorage } from "../storage/localStorage";

function readEntries(): PasswordEntry[] {
  const rawEntries = readFromStorage(ENTRY_STORAGE_KEY);

  if (!rawEntries) {
    return [];
  }

  return JSON.parse(rawEntries) as PasswordEntry[];
}

function saveEntries(entries: PasswordEntry[]): void {
  writeToStorage(ENTRY_STORAGE_KEY, JSON.stringify(entries));
}

export function getPasswordEntries(): PasswordEntry[] {
  return readEntries();
}

export function addPasswordEntry(entryInput: PasswordEntryInput): PasswordEntry {
  const nextEntry: PasswordEntry = {
    id: window.crypto.randomUUID(),
    title: entryInput.title.trim(),
    username: entryInput.username.trim(),
    password: entryInput.password,
    url: entryInput.url.trim(),
  };
  const entries = [...readEntries(), nextEntry];

  saveEntries(entries);

  return nextEntry;
}
