import { ACCOUNT_STORAGE_KEY } from "../../constants/auth";
import type {
  AuthResult,
  MasterPasswordCredentials,
  ResetMasterPasswordInput,
  StoredAccount,
} from "../../models/auth";
import {
  createRandomBase64,
  decryptText,
  deriveEncryptionKey,
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
      typeof parsedValue.salt !== "string" ||
      typeof parsedValue.verifierIv !== "string" ||
      typeof parsedValue.verifierPayload !== "string"
    ) {
      removeFromStorage(ACCOUNT_STORAGE_KEY);
      return null;
    }

    return {
      salt: parsedValue.salt,
      verifierIv: parsedValue.verifierIv,
      verifierPayload: parsedValue.verifierPayload,
    };
  } catch {
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
  const salt = createRandomBase64(16);
  const encryptionKey = await deriveEncryptionKey(credentials.password, salt);
  const encryptedVerifier = await encryptText(MASTER_PASSWORD_VERIFIER, encryptionKey);

  return {
    storedAccount: {
      salt,
      verifierIv: encryptedVerifier.iv,
      verifierPayload: encryptedVerifier.payload,
    },
    encryptionKey,
  };
}

async function validateStoredCredentials(
  credentials: MasterPasswordCredentials,
): Promise<CryptoKey | null> {
  const storedAccount = readStoredAccount();

  if (!storedAccount) {
    return null;
  }

  const encryptionKey = await deriveEncryptionKey(credentials.password, storedAccount.salt);
  const verifier = await decryptText(
    storedAccount.verifierPayload,
    storedAccount.verifierIv,
    encryptionKey,
  );

  if (verifier !== MASTER_PASSWORD_VERIFIER) {
    return null;
  }

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
    const encryptionKey = await validateStoredCredentials(credentials);

    if (!encryptionKey) {
      return {
        status: "error",
        message: "Master password is invalid.",
      };
    }

    activeSession = {
      encryptionKey,
    };

    return {
      status: "success",
      message: "Vault unlocked successfully.",
    };
  } catch {
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
    const currentEncryptionKey = await validateStoredCredentials({
      password: input.currentPassword,
    });

    if (!currentEncryptionKey) {
      return {
        status: "error",
        message: "Current master password is invalid.",
      };
    }

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
  } catch {
    return {
      status: "error",
      message: "Current master password is invalid.",
    };
  }
}
