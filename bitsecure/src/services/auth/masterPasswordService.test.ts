import {
  clearActiveEncryptionKey,
  initializeMasterPassword,
  login,
  resetMasterPassword,
} from "./masterPasswordService";

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
});
