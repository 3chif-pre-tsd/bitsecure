import { useEffect, useState } from "react";
import AuthPanel from "./components/AuthPanel";
import Dashboard from "./components/Dashboard";
import { DEFAULT_USER } from "./constants/auth";
import type { AuthResult } from "./models/auth";
import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "./models/passwordEntry";
import {
  clearActiveEncryptionKey,
  hasMasterPassword as hasStoredMasterPassword,
  setMasterPassword,
  validateMasterPassword,
} from "./services/auth/masterPasswordService";
import {
  addPasswordEntry,
  getPasswordEntries,
} from "./services/entries/passwordEntryService";
import { validatePasswordEntry } from "./services/entries/entryValidation";

const EMPTY_ENTRY_DRAFT: PasswordEntryInput = {
  title: "",
  username: "",
  password: "",
  url: "",
  notes: "",
};

export default function App() {
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [draftPassword, setDraftPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [entryDraft, setEntryDraft] = useState<PasswordEntryInput>(EMPTY_ENTRY_DRAFT);
  const [entryErrors, setEntryErrors] = useState<PasswordEntryValidationErrors>({});
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isSavingEntry, setIsSavingEntry] = useState(false);

  useEffect(() => {
    setHasMasterPassword(hasStoredMasterPassword());
  }, []);

  async function loadEntries(nextSelectedEntryId?: string | null) {
    const storedEntries = await getPasswordEntries();

    setEntries(storedEntries);
    setSelectedEntryId((currentSelectedEntryId) => {
      const requestedEntryId = nextSelectedEntryId ?? currentSelectedEntryId;

      if (!requestedEntryId) {
        return storedEntries[0]?.id ?? null;
      }

      return storedEntries.some((entry) => entry.id === requestedEntryId)
        ? requestedEntryId
        : storedEntries[0]?.id ?? null;
    });
  }

  async function handleAuthSubmit() {
    setIsSubmitting(true);

    const result = hasMasterPassword
      ? await validateMasterPassword(draftPassword)
      : await setMasterPassword(draftPassword);

    setAuthResult(result);
    setIsSubmitting(false);

    if (result.status === "success") {
      setHasMasterPassword(true);
      setIsAuthenticated(true);
      setDraftPassword("");
      await loadEntries();
    }
  }

  function handleEntryDraftChange(field: keyof PasswordEntryInput, value: string) {
    setEntryDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
    setEntryErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  async function handleSaveEntry() {
    const validationErrors = validatePasswordEntry(entryDraft);

    if (Object.keys(validationErrors).length > 0) {
      setEntryErrors(validationErrors);
      return;
    }

    setIsSavingEntry(true);
    const createdEntry = await addPasswordEntry(entryDraft);
    await loadEntries(createdEntry.id);

    setEntryDraft(EMPTY_ENTRY_DRAFT);
    setEntryErrors({});
    setIsSavingEntry(false);
  }

  function handleSelectEntry(entryId: string) {
    setSelectedEntryId(entryId);
  }

  function handleLogout() {
    clearActiveEncryptionKey();
    setIsAuthenticated(false);
    setDraftPassword("");
    setAuthResult(null);
    setEntries([]);
    setSelectedEntryId(null);
    setEntryDraft(EMPTY_ENTRY_DRAFT);
    setEntryErrors({});
  }

  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) ?? null;

  return (
    <>
      {!isAuthenticated ? (
        <AuthPanel
          hasMasterPassword={hasMasterPassword}
          draftPassword={draftPassword}
          isSubmitting={isSubmitting}
          authResult={authResult}
          onPasswordChange={setDraftPassword}
          onSubmit={handleAuthSubmit}
        />
      ) : (
        <Dashboard
          user={DEFAULT_USER}
          entries={entries}
          selectedEntry={selectedEntry}
          entryDraft={entryDraft}
          entryErrors={entryErrors}
          isSavingEntry={isSavingEntry}
          onEntryDraftChange={handleEntryDraftChange}
          onSaveEntry={handleSaveEntry}
          onSelectEntry={handleSelectEntry}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
