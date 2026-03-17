import { ENTRY_STORAGE_KEY } from "../../constants/auth";
import {
  clearActiveEncryptionKey,
  initializeMasterPassword,
  login,
  resetMasterPassword,
} from "../auth/masterPasswordService";
import { addPasswordEntry, getPasswordEntries } from "./passwordEntryService";

describe("passwordEntryService", () => {
  beforeEach(async () => {
    window.localStorage.clear();
    clearActiveEncryptionKey();
    await initializeMasterPassword({
      password: "Sup3rSecret!",
    });
  });

  it("adds a password entry and returns it from encrypted storage", async () => {
    const createdEntry = await addPasswordEntry({
      title: "GitHub",
      username: "octocat",
      password: "pa55word",
      url: "https://github.com",
      notes: "Primary development account",
    });
    const storedEntries = await getPasswordEntries();
    const rawStorageValue = window.localStorage.getItem(ENTRY_STORAGE_KEY);

    expect(createdEntry.title).toBe("GitHub");
    expect(storedEntries).toHaveLength(1);
    expect(storedEntries[0]).toMatchObject({
      id: createdEntry.id,
      title: "GitHub",
      username: "octocat",
      password: "pa55word",
      url: "https://github.com",
      notes: "Primary development account",
    });
    expect(rawStorageValue).not.toContain("pa55word");
    expect(rawStorageValue).not.toContain("octocat");
  });

  it("keeps vault entries accessible after resetting the master password", async () => {
    await addPasswordEntry({
      title: "Bitbucket",
      username: "alice@example.com",
      password: "trim-me-not",
      url: "https://bitbucket.org",
      notes: "Work repository access",
    });

    const resetResult = await resetMasterPassword({
      currentPassword: "Sup3rSecret!",
      newPassword: "N3wSecret!",
    });

    clearActiveEncryptionKey();
    const loginResult = await login({
      password: "N3wSecret!",
    });
    const storedEntries = await getPasswordEntries();

    expect(resetResult.status).toBe("success");
    expect(loginResult.status).toBe("success");
    expect(storedEntries[0]).toMatchObject({
      title: "Bitbucket",
      username: "alice@example.com",
      password: "trim-me-not",
    });
  });
});
