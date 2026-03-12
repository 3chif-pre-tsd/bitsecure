import type { PasswordEntry, PasswordEntryInput } from "../../models/passwordEntry";
import { getActiveEncryptionKey } from "../auth/masterPasswordService";
import { readVaultEntriesWithKey, writeVaultEntriesWithKey } from "../storage/encryptedVaultStorage";

function getSessionKey(): CryptoKey {
  const encryptionKey = getActiveEncryptionKey();

  if (!encryptionKey) {
    throw new Error("No active encryption session.");
  }

  return encryptionKey;
}

function normalizeEntryInput(entryInput: PasswordEntryInput): PasswordEntryInput {
  return {
    title: entryInput.title.trim(),
    username: entryInput.username.trim(),
    password: entryInput.password,
    url: entryInput.url.trim(),
    notes: entryInput.notes.trim(),
  };
}

export async function getPasswordEntries(): Promise<PasswordEntry[]> {
  return readVaultEntriesWithKey(getSessionKey());
}

export async function addPasswordEntry(entryInput: PasswordEntryInput): Promise<PasswordEntry> {
  const normalizedEntry = normalizeEntryInput(entryInput);
  const now = new Date().toISOString();
  const nextEntry: PasswordEntry = {
    id: window.crypto.randomUUID(),
    ...normalizedEntry,
    createdAt: now,
    updatedAt: now,
  };
  const entries = [...(await getPasswordEntries()), nextEntry];

  await writeVaultEntriesWithKey(entries, getSessionKey());

  return nextEntry;
}

export async function updatePasswordEntry(
  entryId: string,
  entryInput: PasswordEntryInput,
): Promise<PasswordEntry | null> {
  const normalizedEntry = normalizeEntryInput(entryInput);
  const entries = await getPasswordEntries();
  const existingEntry = entries.find((entry) => entry.id === entryId);

  if (!existingEntry) {
    return null;
  }

  const updatedEntry: PasswordEntry = {
    ...existingEntry,
    ...normalizedEntry,
    updatedAt: new Date().toISOString(),
  };
  const nextEntries = entries.map((entry) => (entry.id === entryId ? updatedEntry : entry));

  await writeVaultEntriesWithKey(nextEntries, getSessionKey());

  return updatedEntry;
}

export async function deletePasswordEntry(entryId: string): Promise<boolean> {
  const entries = await getPasswordEntries();
  const nextEntries = entries.filter((entry) => entry.id !== entryId);

  if (nextEntries.length === entries.length) {
    return false;
  }

  await writeVaultEntriesWithKey(nextEntries, getSessionKey());

  return true;
}
