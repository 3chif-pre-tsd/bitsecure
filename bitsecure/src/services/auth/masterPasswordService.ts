import { ACCOUNT_STORAGE_KEY } from "../../constants/auth";
import type {
  AuthCredentials,
  AuthResult,
  ResetMasterPasswordInput,
  StoredAccount,
  UserProfile,
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

const MASTER_PASSWORD_VERIFIER = "BitSecure master password verifier";

let activeSession: { username: string; encryptionKey: CryptoKey } | null = null;

function readStoredAccount(): StoredAccount | null {
  const rawValue = readFromStorage(ACCOUNT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredAccount>;

    if (
      typeof parsedValue.salt !== "string" ||
      typeof parsedValue.usernameIv !== "string" ||
      typeof parsedValue.usernamePayload !== "string" ||
      typeof parsedValue.verifierIv !== "string" ||
      typeof parsedValue.verifierPayload !== "string"
    ) {
      removeFromStorage(ACCOUNT_STORAGE_KEY);
      return null;
    }

    return {
      salt: parsedValue.salt,
      usernameIv: parsedValue.usernameIv,
      usernamePayload: parsedValue.usernamePayload,
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

function validateCredentialsInput(credentials: AuthCredentials): AuthResult | null {
  if (!credentials.username.trim()) {
    return {
      status: "error",
      message: "Username is required.",
    };
  }

  if (!credentials.password.trim()) {
    return {
      status: "error",
      message: "Master password is required.",
    };
  }

  return null;
}

async function buildStoredAccount(
  credentials: AuthCredentials,
): Promise<{ storedAccount: StoredAccount; encryptionKey: CryptoKey }> {
  const salt = createRandomBase64(16);
  const encryptionKey = await deriveEncryptionKey(credentials.password, salt);
  const encryptedUsername = await encryptText(credentials.username.trim(), encryptionKey);
  const encryptedVerifier = await encryptText(MASTER_PASSWORD_VERIFIER, encryptionKey);

  return {
    storedAccount: {
      salt,
      usernameIv: encryptedUsername.iv,
      usernamePayload: encryptedUsername.payload,
      verifierIv: encryptedVerifier.iv,
      verifierPayload: encryptedVerifier.payload,
    },
    encryptionKey,
  };
}

async function validateStoredCredentials(
  credentials: AuthCredentials,
): Promise<{ username: string; encryptionKey: CryptoKey } | null> {
  const storedAccount = readStoredAccount();

  if (!storedAccount) {
    return null;
  }

  const encryptionKey = await deriveEncryptionKey(credentials.password, storedAccount.salt);
  const [storedUsername, verifier] = await Promise.all([
    decryptText(storedAccount.usernamePayload, storedAccount.usernameIv, encryptionKey),
    decryptText(storedAccount.verifierPayload, storedAccount.verifierIv, encryptionKey),
  ]);

  if (
    verifier !== MASTER_PASSWORD_VERIFIER ||
    storedUsername !== credentials.username.trim()
  ) {
    return null;
  }

  return {
    username: storedUsername,
    encryptionKey,
  };
}

export function hasConfiguredAccount(): boolean {
  return readStoredAccount() !== null;
}

export function getActiveUserProfile(): UserProfile | null {
  if (!activeSession) {
    return null;
  }

  return {
    username: activeSession.username,
  };
}

export function getActiveEncryptionKey(): CryptoKey | null {
  return activeSession?.encryptionKey ?? null;
}

export function clearActiveEncryptionKey(): void {
  activeSession = null;
}

export async function registerAccount(credentials: AuthCredentials): Promise<AuthResult> {
  const validationResult = validateCredentialsInput(credentials);

  if (validationResult) {
    return validationResult;
  }

  const { storedAccount, encryptionKey } = await buildStoredAccount(credentials);

  saveStoredAccount(storedAccount);
  activeSession = {
    username: credentials.username.trim(),
    encryptionKey,
  };

  return {
    status: "success",
    message: "Account created successfully.",
  };
}

export async function login(credentials: AuthCredentials): Promise<AuthResult> {
  const validationResult = validateCredentialsInput(credentials);

  if (validationResult) {
    return validationResult;
  }

  const storedAccount = readStoredAccount();

  if (!storedAccount) {
    return {
      status: "error",
      message: "No account has been configured yet.",
    };
  }

  try {
    const validatedCredentials = await validateStoredCredentials(credentials);

    if (!validatedCredentials) {
      return {
        status: "error",
        message: "Username or master password is invalid.",
      };
    }

    activeSession = validatedCredentials;

    return {
      status: "success",
      message: "Login successful.",
    };
  } catch {
    return {
      status: "error",
      message: "Username or master password is invalid.",
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

  if (!input.newPassword.trim()) {
    return {
      status: "error",
      message: "New master password is required.",
    };
  }

  if (input.currentPassword === input.newPassword) {
    return {
      status: "error",
      message: "New master password must be different from the current one.",
    };
  }

  try {
    const validatedCredentials = await validateStoredCredentials({
      username: activeSession.username,
      password: input.currentPassword,
    });

    if (!validatedCredentials) {
      return {
        status: "error",
        message: "Current master password is invalid.",
      };
    }

    const entries = await readVaultEntriesWithKey(validatedCredentials.encryptionKey);
    const { storedAccount, encryptionKey } = await buildStoredAccount({
      username: activeSession.username,
      password: input.newPassword,
    });

    await writeVaultEntriesWithKey(entries, encryptionKey);
    saveStoredAccount(storedAccount);
    activeSession = {
      username: activeSession.username,
      encryptionKey,
    };

    return {
      status: "success",
      message: "Master password updated successfully.",
    };
  } catch {
    return {
      status: "error",
      message: "Master password could not be updated.",
    };
  }
}
