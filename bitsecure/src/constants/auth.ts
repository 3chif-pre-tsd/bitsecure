export const AUTH_STORAGE_KEY = "bitsecure.masterPassword";
export const ENTRY_STORAGE_KEY = "bitsecure.entries";
export const HASH_ALGORITHM = "PBKDF2";
export const HASH_DIGEST = "SHA-256";
export const HASH_ITERATIONS = 120_000;
export const SALT_LENGTH = 16;
export const HASH_LENGTH = 32;

export const DEFAULT_USER = {
  displayName: "BitSecure User",
  email: "user@bitsecure.local",
  role: "Vault Owner",
};
