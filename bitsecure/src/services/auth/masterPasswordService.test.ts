import {
  clearActiveEncryptionKey,
  getActiveUserProfile,
  login,
  registerAccount,
  resetMasterPassword,
} from "./masterPasswordService";

describe("masterPasswordService", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearActiveEncryptionKey();
  });

  it("registers and logs in with username and master password", async () => {
    const registerResult = await registerAccount({
      username: "david",
      password: "Sup3rSecret!",
    });

    clearActiveEncryptionKey();

    const loginResult = await login({
      username: "david",
      password: "Sup3rSecret!",
    });

    expect(registerResult.status).toBe("success");
    expect(loginResult.status).toBe("success");
    expect(getActiveUserProfile()).toEqual({
      username: "david",
    });
  });

  it("rejects a reset when the current password is invalid", async () => {
    await registerAccount({
      username: "david",
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
