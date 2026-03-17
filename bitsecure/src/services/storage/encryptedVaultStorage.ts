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

function arePasswordEntries(value: unknown): value is PasswordEntry[] {
  return Array.isArray(value) && value.every(isPasswordEntry);
}

function resetCorruptedVaultStorage(rawEntries: string, reason: string, error?: unknown): PasswordEntry[] {
  console.error(reason, {
    error,
    rawEntries,
  });
  removeFromStorage(ENTRY_STORAGE_KEY);
  return [];
}

export async function readVaultEntriesWithKey(key: CryptoKey): Promise<PasswordEntry[]> {
  const rawEntries = readFromStorage(ENTRY_STORAGE_KEY);

  if (!rawEntries) {
    return [];
  }

  let encryptedEntries: Partial<StoredEncryptedEntries>;
  let parsedStorageValue: unknown;

  try {
    parsedStorageValue = JSON.parse(rawEntries);
  } catch (error) {
    return resetCorruptedVaultStorage(rawEntries, "Stored vault data is not valid JSON.", error);
  }

  if (arePasswordEntries(parsedStorageValue)) {
    try {
      await writeVaultEntriesWithKey(parsedStorageValue, key);
      return parsedStorageValue;
    } catch (error) {
      return resetCorruptedVaultStorage(
        rawEntries,
        "Failed to migrate legacy plaintext vault storage.",
        error,
      );
    }
  }

  encryptedEntries = parsedStorageValue as Partial<StoredEncryptedEntries>;

  if (
    typeof encryptedEntries.iv !== "string" ||
    typeof encryptedEntries.payload !== "string"
  ) {
    return resetCorruptedVaultStorage(rawEntries, "Stored vault data has an invalid format.");
  }

  let payload: string;

  try {
    payload = await decryptText(encryptedEntries.payload, encryptedEntries.iv, key);
  } catch (error) {
    return resetCorruptedVaultStorage(rawEntries, "Stored vault data could not be decrypted.", error);
  }

  let parsedEntries: unknown;

  try {
    parsedEntries = JSON.parse(payload);
  } catch (error) {
    return resetCorruptedVaultStorage(
      rawEntries,
      "Decrypted vault data is not valid JSON.",
      error,
    );
  }

  if (!arePasswordEntries(parsedEntries)) {
    return resetCorruptedVaultStorage(rawEntries, "Decrypted vault data has an invalid shape.");
  }

  return parsedEntries;
}

export async function writeVaultEntriesWithKey(
  entries: PasswordEntry[],
  key: CryptoKey,
): Promise<void> {
  if (!arePasswordEntries(entries)) {
    throw new Error("Vault entries are invalid.");
  }

  try {
    const encryptedEntries = await encryptText(JSON.stringify(entries), key);
    writeToStorage(ENTRY_STORAGE_KEY, JSON.stringify(encryptedEntries));
  } catch (error) {
    console.error("Failed to encrypt and store vault entries.", error);
    throw error;
  }
}
