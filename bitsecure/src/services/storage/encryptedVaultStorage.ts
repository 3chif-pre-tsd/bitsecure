import { ENTRY_STORAGE_KEY } from "../../constants/auth";
import type {
  PasswordEntry,
  StoredEncryptedEntries,
} from "../../models/passwordEntry";
import { decryptText, encryptText } from "../security/cryptoService";
import { readFromStorage, removeFromStorage, writeToStorage } from "./localStorage";

function isPasswordEntry(value: unknown): value is PasswordEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "string" &&
    typeof entry.title === "string" &&
    typeof entry.username === "string" &&
    typeof entry.password === "string" &&
    typeof entry.url === "string" &&
    typeof entry.notes === "string" &&
    typeof entry.createdAt === "string" &&
    typeof entry.updatedAt === "string"
  );
}

export async function readVaultEntriesWithKey(key: CryptoKey): Promise<PasswordEntry[]> {
  const rawEntries = readFromStorage(ENTRY_STORAGE_KEY);

  if (!rawEntries) {
    return [];
  }

  let encryptedEntries: Partial<StoredEncryptedEntries>;

  try {
    encryptedEntries = JSON.parse(rawEntries) as Partial<StoredEncryptedEntries>;
  } catch {
    removeFromStorage(ENTRY_STORAGE_KEY);
    throw new Error("Stored vault data is invalid.");
  }

  if (
    typeof encryptedEntries.iv !== "string" ||
    typeof encryptedEntries.payload !== "string"
  ) {
    throw new Error("Stored vault data is invalid.");
  }

  const payload = await decryptText(encryptedEntries.payload, encryptedEntries.iv, key);
  let parsedEntries: unknown;

  try {
    parsedEntries = JSON.parse(payload);
  } catch {
    throw new Error("Stored vault data is invalid.");
  }

  if (!Array.isArray(parsedEntries) || !parsedEntries.every(isPasswordEntry)) {
    throw new Error("Stored vault data is invalid.");
  }

  return parsedEntries;
}

export async function writeVaultEntriesWithKey(
  entries: PasswordEntry[],
  key: CryptoKey,
): Promise<void> {
  const encryptedEntries = await encryptText(JSON.stringify(entries), key);
  writeToStorage(ENTRY_STORAGE_KEY, JSON.stringify(encryptedEntries));
}
