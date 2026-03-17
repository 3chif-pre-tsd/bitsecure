const CRYPTO_KEY_ALGORITHM = "AES-GCM";
const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

function encodeBase64(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
}

function decodeBase64(value: string): Uint8Array {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function getCryptoApi(): Crypto {
  return window.crypto;
}

export function createRandomBase64(size: number): string {
  const bytes = new Uint8Array(size);
  getCryptoApi().getRandomValues(bytes);

  return encodeBase64(bytes);
}

export async function deriveMasterKey(password: string): Promise<CryptoKey> {
  const keyMaterial = await getCryptoApi().subtle.digest("SHA-256", TEXT_ENCODER.encode(password));

  return getCryptoApi().subtle.importKey(
    "raw",
    keyMaterial,
    {
      name: CRYPTO_KEY_ALGORITHM,
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function deriveLegacyEncryptionKey(
  password: string,
  salt: string,
): Promise<CryptoKey> {
  const baseKey = await getCryptoApi().subtle.importKey(
    "raw",
    TEXT_ENCODER.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return getCryptoApi().subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: decodeBase64(salt),
      iterations: 250_000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: CRYPTO_KEY_ALGORITHM,
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptText(
  plaintext: string,
  key: CryptoKey,
): Promise<{ iv: string; payload: string }> {
  const iv = new Uint8Array(12);
  getCryptoApi().getRandomValues(iv);
  const encryptedValue = await getCryptoApi().subtle.encrypt(
    {
      name: CRYPTO_KEY_ALGORITHM,
      iv,
    },
    key,
    TEXT_ENCODER.encode(plaintext),
  );

  return {
    iv: encodeBase64(iv),
    payload: encodeBase64(new Uint8Array(encryptedValue)),
  };
}

export async function decryptText(
  payload: string,
  iv: string,
  key: CryptoKey,
): Promise<string> {
  const decryptedValue = await getCryptoApi().subtle.decrypt(
    {
      name: CRYPTO_KEY_ALGORITHM,
      iv: decodeBase64(iv),
    },
    key,
    decodeBase64(payload),
  );

  return TEXT_DECODER.decode(decryptedValue);
}
