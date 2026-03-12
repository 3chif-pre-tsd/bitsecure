import { ENTRY_STORAGE_KEY } from "../../constants/auth";
import type {
  PasswordEntry,
  PasswordEntryInput,
  StoredEncryptedEntries,
} from "../../models/passwordEntry";
import { getActiveEncryptionKey } from "../auth/masterPasswordService";
import { decryptText, encryptText } from "../security/cryptoService";
import { readFromStorage, writeToStorage } from "../storage/localStorage";

function getSessionKey(): CryptoKey {
  const encryptionKey = getActiveEncryptionKey();

  if (!encryptionKey) {
    throw new Error("No active encryption session.");
  }

  return encryptionKey;
}

async function readEntries(): Promise<PasswordEntry[]> {
  const rawEntries = readFromStorage(ENTRY_STORAGE_KEY);

  if (!rawEntries) {
    return [];
  }

  try {
    const encryptedEntries = JSON.parse(rawEntries) as Partial<StoredEncryptedEntries>;

    if (
      typeof encryptedEntries.iv !== "string" ||
      typeof encryptedEntries.payload !== "string"
    ) {
      return [];
    }

    const payload = await decryptText(
      encryptedEntries.payload,
      encryptedEntries.iv,
      getSessionKey(),
    );
    const parsedEntries = JSON.parse(payload);

    if (!Array.isArray(parsedEntries)) {
      return [];
    }

    return parsedEntries as PasswordEntry[];
  } catch {
    return [];
  }
}

async function saveEntries(entries: PasswordEntry[]): Promise<void> {
  const encryptedEntries = await encryptText(JSON.stringify(entries), getSessionKey());
  writeToStorage(ENTRY_STORAGE_KEY, JSON.stringify(encryptedEntries));
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
  return readEntries();
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
  const entries = [...(await readEntries()), nextEntry];

  await saveEntries(entries);

  return nextEntry;
}
