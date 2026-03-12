import { AUTH_STORAGE_KEY } from "../../constants/auth";
import type { AuthResult, StoredMasterPassword } from "../../models/auth";
import {
  createRandomBase64,
  decryptText,
  deriveEncryptionKey,
  encryptText,
} from "../security/cryptoService";
import {
  readFromStorage,
  removeFromStorage,
  writeToStorage,
} from "../storage/localStorage";

const MASTER_PASSWORD_VERIFIER = "BitSecure master password verifier";

let activeEncryptionKey: CryptoKey | null = null;

function readStoredMasterPassword(): StoredMasterPassword | null {
  const rawValue = readFromStorage(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredMasterPassword>;

    if (
      typeof parsedValue.salt !== "string" ||
      typeof parsedValue.iv !== "string" ||
      typeof parsedValue.verifier !== "string"
    ) {
      removeFromStorage(AUTH_STORAGE_KEY);
      return null;
    }

    return {
      salt: parsedValue.salt,
      iv: parsedValue.iv,
      verifier: parsedValue.verifier,
    };
  } catch {
    removeFromStorage(AUTH_STORAGE_KEY);
    return null;
  }
}

function saveStoredMasterPassword(payload: StoredMasterPassword): void {
  writeToStorage(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

function validatePasswordInput(masterPassword: string): AuthResult | null {
  if (!masterPassword.trim()) {
    return {
      status: "error",
      message: "Master password is required.",
    };
  }

  return null;
}

export function hasMasterPassword(): boolean {
  return readStoredMasterPassword() !== null;
}

export function getActiveEncryptionKey(): CryptoKey | null {
  return activeEncryptionKey;
}

export function clearActiveEncryptionKey(): void {
  activeEncryptionKey = null;
}

export async function setMasterPassword(masterPassword: string): Promise<AuthResult> {
  const validationResult = validatePasswordInput(masterPassword);

  if (validationResult) {
    return validationResult;
  }

  const salt = createRandomBase64(16);
  const encryptionKey = await deriveEncryptionKey(masterPassword, salt);
  const encryptedVerifier = await encryptText(MASTER_PASSWORD_VERIFIER, encryptionKey);

  saveStoredMasterPassword({
    salt,
    iv: encryptedVerifier.iv,
    verifier: encryptedVerifier.payload,
  });
  activeEncryptionKey = encryptionKey;

  return {
    status: "success",
    message: "Master password saved successfully.",
  };
}

export async function validateMasterPassword(masterPassword: string): Promise<AuthResult> {
  const validationResult = validatePasswordInput(masterPassword);

  if (validationResult) {
    return validationResult;
  }

  const storedMasterPassword = readStoredMasterPassword();

  if (!storedMasterPassword) {
    return {
      status: "error",
      message: "No master password has been configured yet.",
    };
  }

  try {
    const encryptionKey = await deriveEncryptionKey(
      masterPassword,
      storedMasterPassword.salt,
    );
    const verifier = await decryptText(
      storedMasterPassword.verifier,
      storedMasterPassword.iv,
      encryptionKey,
    );

    if (verifier !== MASTER_PASSWORD_VERIFIER) {
      return {
        status: "error",
        message: "Master password is invalid.",
      };
    }

    activeEncryptionKey = encryptionKey;

    return {
      status: "success",
      message: "Login successful.",
    };
  } catch {
    return {
      status: "error",
      message: "Master password is invalid.",
    };
  }
}
