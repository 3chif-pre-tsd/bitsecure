const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+";

export function generateRandomPassword(length = 18): string {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => PASSWORD_ALPHABET[byte % PASSWORD_ALPHABET.length]).join(
    "",
  );
}
