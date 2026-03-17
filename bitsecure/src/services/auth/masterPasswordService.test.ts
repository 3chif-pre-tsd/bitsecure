import {
  ACCOUNT_STORAGE_KEY,
  ENTRY_STORAGE_KEY,
} from "../../constants/auth";
import {
  clearActiveEncryptionKey,
  initializeMasterPassword,
  login,
  resetLocalVaultState,
  resetMasterPassword,
} from "./masterPasswordService";
import { deriveLegacyEncryptionKey, encryptText } from "../security/cryptoService";

describe("masterPasswordService", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearActiveEncryptionKey();
  });

  it("initializes and unlocks the vault with the master password", async () => {
    const setupResult = await initializeMasterPassword({
      password: "Sup3rSecret!",
    });

    clearActiveEncryptionKey();

    const loginResult = await login({
      password: "Sup3rSecret!",
    });

    expect(setupResult.status).toBe("success");
    expect(loginResult).toEqual({
      status: "success",
      message: "Vault unlocked successfully.",
    });
  });

  it("rejects a reset when the current password is invalid", async () => {
    await initializeMasterPassword({
      password: "Sup3rSecret!",
    });

    const resetResult = await resetMasterPassword({
      currentPassword: "wrong-password",
      newPassword: "N3wSecret!",
    });

    expect(resetResult).toEqual({
      status: "error",
      message: "Current master password is invalid.",
    });
  });

  it("migrates a legacy salted account to the shared master key on login", async () => {
    const legacySalt = window.btoa("legacy-salt-value");
    const legacyKey = await deriveLegacyEncryptionKey("Sup3rSecret!", legacySalt);
    const verifier = await encryptText("BitSecure master password verifier", legacyKey);
    const legacyEntries = await encryptText(
      JSON.stringify([
        {
          id: "legacy-entry",
          title: "Legacy",
          username: "octocat",
          password: "pa55word",
          url: "https://github.com",
          notes: "migrated",
          createdAt: "2026-03-17T10:00:00.000Z",
          updatedAt: "2026-03-17T10:00:00.000Z",
        },
      ]),
      legacyKey,
    );

    window.localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify({
        salt: legacySalt,
        verifierIv: verifier.iv,
        verifierPayload: verifier.payload,
      }),
    );
    window.localStorage.setItem(ENTRY_STORAGE_KEY, JSON.stringify(legacyEntries));

    const loginResult = await login({
      password: "Sup3rSecret!",
    });
    const migratedAccount = JSON.parse(window.localStorage.getItem(ACCOUNT_STORAGE_KEY) ?? "null");

    expect(loginResult).toEqual({
      status: "success",
      message: "Vault unlocked successfully.",
    });
    expect(migratedAccount).toMatchObject({
      verifierIv: expect.any(String),
      verifierPayload: expect.any(String),
    });
    expect(migratedAccount.salt).toBeUndefined();
  });

  it("clears the local vault account, entries, and session state", async () => {
    await initializeMasterPassword({
      password: "Sup3rSecret!",
    });

    window.localStorage.setItem(ENTRY_STORAGE_KEY, JSON.stringify({ iv: "demo", payload: "demo" }));

    resetLocalVaultState();

    expect(window.localStorage.getItem(ACCOUNT_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(ENTRY_STORAGE_KEY)).toBeNull();

    const loginResult = await login({
      password: "Sup3rSecret!",
    });

    expect(loginResult).toEqual({
      status: "error",
      message: "No master password has been configured yet.",
    });
  });
});
