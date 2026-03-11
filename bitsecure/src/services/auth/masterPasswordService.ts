import {
  AUTH_STORAGE_KEY,
  HASH_ALGORITHM,
  HASH_DIGEST,
  HASH_ITERATIONS,
  HASH_LENGTH,
  SALT_LENGTH,
} from "../../constants/auth";
import type { AuthResult, StoredMasterPassword } from "../../models/auth";
import { readFromStorage, writeToStorage } from "../storage/localStorage";

function encoder() {
  return new TextEncoder();
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }

  return bytes;
}

function createSalt(): Uint8Array {
  const salt = new Uint8Array(SALT_LENGTH);
  window.crypto.getRandomValues(salt);
  return salt;
}

async function deriveHash(masterPassword: string, salt: Uint8Array): Promise<string> {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder().encode(masterPassword),
    HASH_ALGORITHM,
    false,
    ["deriveBits"],
  );
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: HASH_ALGORITHM,
      hash: HASH_DIGEST,
      salt,
      iterations: HASH_ITERATIONS,
    },
    keyMaterial,
    HASH_LENGTH * 8,
  );

  return bufferToHex(derivedBits);
}

function readStoredMasterPassword(): StoredMasterPassword | null {
  const rawValue = readFromStorage(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as StoredMasterPassword;
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

export async function setMasterPassword(masterPassword: string): Promise<AuthResult> {
  const validationResult = validatePasswordInput(masterPassword);

  if (validationResult) {
    return validationResult;
  }

  const salt = createSalt();
  const hash = await deriveHash(masterPassword, salt);

  saveStoredMasterPassword({
    salt: bufferToHex(salt.buffer),
    hash,
  });

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

  const computedHash = await deriveHash(
    masterPassword,
    hexToBytes(storedMasterPassword.salt),
  );

  if (computedHash !== storedMasterPassword.hash) {
    return {
      status: "error",
      message: "Master password is invalid.",
    };
  }

  return {
    status: "success",
    message: "Login successful.",
  };
}
