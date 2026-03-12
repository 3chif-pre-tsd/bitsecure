import { ENTRY_STORAGE_KEY } from "../../constants/auth";
import type {
  PasswordEntry,
  StoredEncryptedEntries,
} from "../../models/passwordEntry";
import { decryptText, encryptText } from "../security/cryptoService";
import { readFromStorage, writeToStorage } from "./localStorage";

export async function readVaultEntriesWithKey(key: CryptoKey): Promise<PasswordEntry[]> {
  const rawEntries = readFromStorage(ENTRY_STORAGE_KEY);

  if (!rawEntries) {
    return [];
  }

  const encryptedEntries = JSON.parse(rawEntries) as Partial<StoredEncryptedEntries>;

  if (
    typeof encryptedEntries.iv !== "string" ||
    typeof encryptedEntries.payload !== "string"
  ) {
    throw new Error("Stored vault data is invalid.");
  }

  const payload = await decryptText(encryptedEntries.payload, encryptedEntries.iv, key);
  const parsedEntries = JSON.parse(payload);

  if (!Array.isArray(parsedEntries)) {
    throw new Error("Stored vault data is invalid.");
  }

  return parsedEntries as PasswordEntry[];
}

export async function writeVaultEntriesWithKey(
  entries: PasswordEntry[],
  key: CryptoKey,
): Promise<void> {
  const encryptedEntries = await encryptText(JSON.stringify(entries), key);
  writeToStorage(ENTRY_STORAGE_KEY, JSON.stringify(encryptedEntries));
}
