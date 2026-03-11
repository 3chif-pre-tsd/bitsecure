import { useEffect, useState } from "react";
import AuthPanel from "./components/AuthPanel";
import Dashboard from "./components/Dashboard";
import { DEFAULT_USER } from "./constants/auth";
import type { AuthResult } from "./models/auth";
import type {
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "./models/passwordEntry";
import {
  hasMasterPassword as hasStoredMasterPassword,
  setMasterPassword,
  validateMasterPassword,
} from "./services/auth/masterPasswordService";
import {
  addPasswordEntry,
  getPasswordEntries,
} from "./services/entries/passwordEntryService";

const EMPTY_ENTRY_DRAFT: PasswordEntryInput = {
  title: "",
  username: "",
  password: "",
  url: "",
};

export default function App() {
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [draftPassword, setDraftPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [entries, setEntries] = useState(getPasswordEntries);
  const [entryDraft, setEntryDraft] = useState<PasswordEntryInput>(EMPTY_ENTRY_DRAFT);
  const [entryErrors, setEntryErrors] = useState<PasswordEntryValidationErrors>({});

  useEffect(() => {
    setHasMasterPassword(hasStoredMasterPassword());
  }, []);

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
      setEntries(getPasswordEntries());
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

  function validateEntryDraft(): PasswordEntryValidationErrors {
    const nextErrors: PasswordEntryValidationErrors = {};

    if (!entryDraft.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!entryDraft.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!entryDraft.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    if (entryDraft.url.trim()) {
      try {
        new URL(entryDraft.url);
      } catch {
        nextErrors.url = "URL must be valid.";
      }
    }

    return nextErrors;
  }

  function handleAddEntry() {
    const validationErrors = validateEntryDraft();

    if (Object.keys(validationErrors).length > 0) {
      setEntryErrors(validationErrors);
      return;
    }

    addPasswordEntry(entryDraft);
    setEntries(getPasswordEntries());
    setEntryDraft(EMPTY_ENTRY_DRAFT);
    setEntryErrors({});
  }

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
          entryDraft={entryDraft}
          entryErrors={entryErrors}
          onEntryDraftChange={handleEntryDraftChange}
          onAddEntry={handleAddEntry}
        />
      )}
    </>
  );
}

