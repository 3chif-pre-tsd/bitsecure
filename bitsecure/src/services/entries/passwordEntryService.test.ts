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

  it("migrates legacy plaintext vault storage to encrypted storage when loading", async () => {
    window.localStorage.setItem(
      ENTRY_STORAGE_KEY,
      JSON.stringify([
        {
          id: "plain-entry",
          title: "Legacy",
          username: "octocat",
          password: "pa55word",
          url: "https://github.com",
          notes: "plaintext",
          createdAt: "2026-03-17T10:00:00.000Z",
          updatedAt: "2026-03-17T10:00:00.000Z",
        },
      ]),
    );

    const storedEntries = await getPasswordEntries();
    const rawStorageValue = window.localStorage.getItem(ENTRY_STORAGE_KEY);

    expect(storedEntries).toHaveLength(1);
    expect(storedEntries[0].id).toBe("plain-entry");
    expect(rawStorageValue).toContain("\"iv\"");
    expect(rawStorageValue).toContain("\"payload\"");
    expect(rawStorageValue).not.toContain("pa55word");
  });

  it("clears corrupted vault storage instead of crashing the session", async () => {
    window.localStorage.setItem(ENTRY_STORAGE_KEY, "{broken-json");

    const storedEntries = await getPasswordEntries();

    expect(storedEntries).toEqual([]);
    expect(window.localStorage.getItem(ENTRY_STORAGE_KEY)).toBeNull();
  });
});
