import { ACCOUNT_STORAGE_KEY, ENTRY_STORAGE_KEY } from "../../constants/auth";
import type {
  AuthResult,
  MasterPasswordCredentials,
  ResetMasterPasswordInput,
  StoredAccount,
} from "../../models/auth";
import {
  decryptText,
  deriveLegacyEncryptionKey,
  deriveMasterKey,
  encryptText,
} from "../security/cryptoService";
import { readVaultEntriesWithKey, writeVaultEntriesWithKey } from "../storage/encryptedVaultStorage";
import {
  readFromStorage,
  removeFromStorage,
  writeToStorage,
} from "../storage/localStorage";
import { validateMasterPassword } from "./authValidation";

const MASTER_PASSWORD_VERIFIER = "BitSecure master password verifier";

let activeSession: { encryptionKey: CryptoKey } | null = null;

function readStoredAccount(): StoredAccount | null {
  const rawValue = readFromStorage(ACCOUNT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredAccount>;

    if (
      typeof parsedValue.verifierIv !== "string" ||
      typeof parsedValue.verifierPayload !== "string" ||
      (parsedValue.salt !== undefined && typeof parsedValue.salt !== "string")
    ) {
      removeFromStorage(ACCOUNT_STORAGE_KEY);
      return null;
    }

    return {
      verifierIv: parsedValue.verifierIv,
      verifierPayload: parsedValue.verifierPayload,
      salt: parsedValue.salt,
    };
  } catch (error) {
    console.error("Failed to parse stored account.", error);
    removeFromStorage(ACCOUNT_STORAGE_KEY);
    return null;
  }
}

function saveStoredAccount(payload: StoredAccount): void {
  writeToStorage(ACCOUNT_STORAGE_KEY, JSON.stringify(payload));
}

async function buildStoredAccount(
  credentials: MasterPasswordCredentials,
): Promise<{ storedAccount: StoredAccount; encryptionKey: CryptoKey }> {
  const encryptionKey = await deriveMasterKey(credentials.password);
  const encryptedVerifier = await encryptText(MASTER_PASSWORD_VERIFIER, encryptionKey);

  return {
    storedAccount: {
      verifierIv: encryptedVerifier.iv,
      verifierPayload: encryptedVerifier.payload,
    },
    encryptionKey,
  };
}

async function tryReadVerifier(
  storedAccount: StoredAccount,
  encryptionKey: CryptoKey,
): Promise<boolean> {
  try {
    const verifier = await decryptText(
      storedAccount.verifierPayload,
      storedAccount.verifierIv,
      encryptionKey,
    );

    return verifier === MASTER_PASSWORD_VERIFIER;
  } catch (error) {
    console.error("Failed to decrypt stored verifier.", error);
    return false;
  }
}

async function validateStoredCredentials(
  credentials: MasterPasswordCredentials,
): Promise<{ encryptionKey: CryptoKey; requiresMigration: boolean } | null> {
  const storedAccount = readStoredAccount();

  if (!storedAccount) {
    return null;
  }

  const encryptionKey = await deriveMasterKey(credentials.password);

  if (await tryReadVerifier(storedAccount, encryptionKey)) {
    return {
      encryptionKey,
      requiresMigration: false,
    };
  }

  if (!storedAccount.salt) {
    return null;
  }

  const legacyEncryptionKey = await deriveLegacyEncryptionKey(credentials.password, storedAccount.salt);

  if (!(await tryReadVerifier(storedAccount, legacyEncryptionKey))) {
    return null;
  }

  return {
    encryptionKey: legacyEncryptionKey,
    requiresMigration: true,
  };
}

async function migrateLegacyAccount(
  credentials: MasterPasswordCredentials,
  legacyKey: CryptoKey,
): Promise<CryptoKey> {
  const entries = await readVaultEntriesWithKey(legacyKey);
  const { storedAccount, encryptionKey } = await buildStoredAccount(credentials);

  await writeVaultEntriesWithKey(entries, encryptionKey);
  saveStoredAccount(storedAccount);

  return encryptionKey;
}

export function hasConfiguredAccount(): boolean {
  return readStoredAccount() !== null;
}

export function getActiveEncryptionKey(): CryptoKey | null {
  return activeSession?.encryptionKey ?? null;
}

export function clearActiveEncryptionKey(): void {
  activeSession = null;
}

export function resetLocalVaultState(): void {
  clearActiveEncryptionKey();
  removeFromStorage(ACCOUNT_STORAGE_KEY);
  removeFromStorage(ENTRY_STORAGE_KEY);
}

export async function initializeMasterPassword(
  credentials: MasterPasswordCredentials,
): Promise<AuthResult> {
  const validationMessage = validateMasterPassword(credentials);

  if (validationMessage) {
    return {
      status: "error",
      message: validationMessage,
    };
  }

  if (hasConfiguredAccount()) {
    return {
      status: "error",
      message: "A vault is already configured. Unlock it with the current master password.",
    };
  }

  const { storedAccount, encryptionKey } = await buildStoredAccount(credentials);

  saveStoredAccount(storedAccount);
  activeSession = {
    encryptionKey,
  };

  return {
    status: "success",
    message: "Master password configured successfully.",
  };
}

export async function login(credentials: MasterPasswordCredentials): Promise<AuthResult> {
  const validationMessage = validateMasterPassword(credentials);

  if (validationMessage) {
    return {
      status: "error",
      message: validationMessage,
    };
  }

  if (!hasConfiguredAccount()) {
    return {
      status: "error",
      message: "No master password has been configured yet.",
    };
  }

  try {
    const validationResult = await validateStoredCredentials(credentials);

    if (!validationResult) {
      return {
        status: "error",
        message: "Master password is invalid.",
      };
    }

    const encryptionKey = validationResult.requiresMigration
      ? await migrateLegacyAccount(credentials, validationResult.encryptionKey)
      : validationResult.encryptionKey;

    activeSession = {
      encryptionKey,
    };

    return {
      status: "success",
      message: "Vault unlocked successfully.",
    };
  } catch (error) {
    console.error("Failed to unlock vault.", error);
    return {
      status: "error",
      message: "Master password is invalid.",
    };
  }
}

export async function resetMasterPassword(
  input: ResetMasterPasswordInput,
): Promise<AuthResult> {
  if (!activeSession) {
    return {
      status: "error",
      message: "You must be logged in to reset the master password.",
    };
  }

  if (!input.currentPassword.trim()) {
    return {
      status: "error",
      message: "Current master password is required.",
    };
  }

  const validationMessage = validateMasterPassword({
    password: input.newPassword,
  });

  if (validationMessage) {
    return {
      status: "error",
      message: validationMessage,
    };
  }

  if (input.currentPassword === input.newPassword) {
    return {
      status: "error",
      message: "New master password must be different from the current one.",
    };
  }

  try {
    const validationResult = await validateStoredCredentials({
      password: input.currentPassword,
    });

    if (!validationResult) {
      return {
        status: "error",
        message: "Current master password is invalid.",
      };
    }

    const currentEncryptionKey = validationResult.requiresMigration
      ? await migrateLegacyAccount(
          {
            password: input.currentPassword,
          },
          validationResult.encryptionKey,
        )
      : validationResult.encryptionKey;
    const entries = await readVaultEntriesWithKey(currentEncryptionKey);
    const { storedAccount, encryptionKey } = await buildStoredAccount({
      password: input.newPassword,
    });

    await writeVaultEntriesWithKey(entries, encryptionKey);
    saveStoredAccount(storedAccount);
    activeSession = {
      encryptionKey,
    };

    return {
      status: "success",
      message: "Master password updated successfully.",
    };
  } catch (error) {
    console.error("Failed to reset master password.", error);
    return {
      status: "error",
      message: "Current master password is invalid.",
    };
  }
}
