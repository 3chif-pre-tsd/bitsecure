import type { MasterPasswordCredentials } from "../../models/auth";

export const MASTER_PASSWORD_MIN_LENGTH = 8;

export function validateMasterPassword(
  credentials: MasterPasswordCredentials,
): string | null {
  if (!credentials.password.trim()) {
    return "Master password is required.";
  }

  if (credentials.password.length < MASTER_PASSWORD_MIN_LENGTH) {
    return `Master password must be at least ${MASTER_PASSWORD_MIN_LENGTH} characters long.`;
  }

  return null;
}
