import { AUTH_STORAGE_KEY } from "../../constants/auth";
import type { AuthResult, StoredMasterPassword } from "../../models/auth";
import { readFromStorage, writeToStorage } from "../storage/localStorage";

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

  saveStoredMasterPassword({
    value: masterPassword,
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

  if (masterPassword !== storedMasterPassword.value) {
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
