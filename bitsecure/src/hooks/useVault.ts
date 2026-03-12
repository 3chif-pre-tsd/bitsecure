import { useEffect, useState } from "react";
import type {
  PasswordEntry,
  PasswordEntryFilterOption,
  PasswordEntryInput,
  PasswordEntrySortOption,
  PasswordEntryValidationErrors,
} from "../models/passwordEntry";
import {
  addPasswordEntry,
  deletePasswordEntry,
  getPasswordEntries,
  updatePasswordEntry,
} from "../services/entries/passwordEntryService";
import { validatePasswordEntry } from "../services/entries/entryValidation";
import { generateRandomPassword } from "../utils/passwords";

const EMPTY_ENTRY_DRAFT: PasswordEntryInput = {
  title: "",
  username: "",
  password: "",
  url: "",
  notes: "",
};

export function useVault(isAuthenticated: boolean) {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [entryDraft, setEntryDraft] = useState<PasswordEntryInput>(EMPTY_ENTRY_DRAFT);
  const [entryErrors, setEntryErrors] = useState<PasswordEntryValidationErrors>({});
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState<PasswordEntryFilterOption>("all");
  const [sortOption, setSortOption] = useState<PasswordEntrySortOption>("updated-desc");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [isSavingEntry, setIsSavingEntry] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setEntries([]);
      setEntryDraft(EMPTY_ENTRY_DRAFT);
      setEntryErrors({});
      setSelectedEntryId(null);
      setSearchQuery("");
      setFilterOption("all");
      setSortOption("updated-desc");
      setEditingEntryId(null);
      setIsSavingEntry(false);
      return;
    }

    void loadEntries();
  }, [isAuthenticated]);

  async function loadEntries(nextSelectedEntryId?: string | null) {
    try {
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
    } catch {
      setEntries([]);
      setSelectedEntryId(null);
    }
  }

  function updateEntryDraft(field: keyof PasswordEntryInput, value: string) {
    setEntryDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
    setEntryErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function generatePassword() {
    updateEntryDraft("password", generateRandomPassword());
  }

  async function saveEntry() {
    const validationErrors = validatePasswordEntry(entryDraft);

    if (Object.keys(validationErrors).length > 0) {
      setEntryErrors(validationErrors);
      return;
    }

    setIsSavingEntry(true);

    try {
      if (editingEntryId) {
        const updatedEntry = await updatePasswordEntry(editingEntryId, entryDraft);

        if (updatedEntry) {
          await loadEntries(updatedEntry.id);
        }
      } else {
        const createdEntry = await addPasswordEntry(entryDraft);
        await loadEntries(createdEntry.id);
      }

      setEntryDraft(EMPTY_ENTRY_DRAFT);
      setEntryErrors({});
      setEditingEntryId(null);
    } finally {
      setIsSavingEntry(false);
    }
  }

  function editEntry(entry: PasswordEntry) {
    setEditingEntryId(entry.id);
    setSelectedEntryId(entry.id);
    setEntryDraft({
      title: entry.title,
      username: entry.username,
      password: entry.password,
      url: entry.url,
      notes: entry.notes,
    });
    setEntryErrors({});
  }

  function cancelEdit() {
    setEditingEntryId(null);
    setEntryDraft(EMPTY_ENTRY_DRAFT);
    setEntryErrors({});
  }

  async function removeEntry(entryId: string) {
    setIsSavingEntry(true);

    try {
      const wasDeleted = await deletePasswordEntry(entryId);

      if (wasDeleted) {
        await loadEntries();
        if (editingEntryId === entryId) {
          cancelEdit();
        }
      }
    } finally {
      setIsSavingEntry(false);
    }
  }

  const visibleEntries = [...entries]
    .filter((entry) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();

      if (
        normalizedQuery &&
        ![entry.title, entry.username, entry.url, entry.notes].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )
      ) {
        return false;
      }

      if (filterOption === "with-url") {
        return Boolean(entry.url);
      }

      if (filterOption === "with-notes") {
        return Boolean(entry.notes);
      }

      return true;
    })
    .sort((leftEntry, rightEntry) => {
      if (sortOption === "title-asc") {
        return leftEntry.title.localeCompare(rightEntry.title);
      }

      const leftValue =
        sortOption === "created-desc" ? leftEntry.createdAt : leftEntry.updatedAt;
      const rightValue =
        sortOption === "created-desc" ? rightEntry.createdAt : rightEntry.updatedAt;

      return new Date(rightValue).getTime() - new Date(leftValue).getTime();
    });

  const selectedEntry = visibleEntries.find((entry) => entry.id === selectedEntryId) ??
    entries.find((entry) => entry.id === selectedEntryId) ??
    null;

  return {
    entries,
    visibleEntries,
    selectedEntry,
    entryDraft,
    entryErrors,
    searchQuery,
    filterOption,
    sortOption,
    editingEntryId,
    isSavingEntry,
    setSearchQuery,
    setFilterOption,
    setSortOption,
    setSelectedEntryId,
    updateEntryDraft,
    generatePassword,
    saveEntry,
    editEntry,
    cancelEdit,
    removeEntry,
  };
}
