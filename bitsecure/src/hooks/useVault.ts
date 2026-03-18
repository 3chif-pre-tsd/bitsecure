import { useEffect, useMemo, useState } from "react";
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

type Feedback = {
  status: "success" | "error";
  message: string;
} | null;

export type WorkspaceMode = "idle" | "view" | "create" | "edit";

export function useVault(isAuthenticated: boolean) {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [entryDraft, setEntryDraft] = useState<PasswordEntryInput>(EMPTY_ENTRY_DRAFT);
  const [entryErrors, setEntryErrors] = useState<PasswordEntryValidationErrors>({});
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState<PasswordEntryFilterOption>("all");
  const [sortOption, setSortOption] = useState<PasswordEntrySortOption>("updated-desc");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("idle");
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [vaultFeedback, setVaultFeedback] = useState<Feedback>(null);

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
      setWorkspaceMode("idle");
      setIsSavingEntry(false);
      setIsLoadingEntries(false);
      setVaultFeedback(null);
      return;
    }

    void loadEntries();
  }, [isAuthenticated]);

  async function loadEntries(nextSelectedEntryId?: string | null) {
    setIsLoadingEntries(true);

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
      setWorkspaceMode((currentMode) => {
        if (currentMode === "create") {
          return "create";
        }

        if (storedEntries.length === 0) {
          return "idle";
        }

        return "view";
      });
      setVaultFeedback(null);
    } catch (error) {
      console.error("Failed to load vault entries.", error);
      setEntries([]);
      setSelectedEntryId(null);
      setEditingEntryId(null);
      setWorkspaceMode("idle");
      setEntryDraft(EMPTY_ENTRY_DRAFT);
      setVaultFeedback({
        status: "error",
        message: "The encrypted vault could not be loaded for this session.",
      });
    } finally {
      setIsLoadingEntries(false);
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
      form: undefined,
    }));
    setVaultFeedback(null);
  }

  function generatePassword() {
    updateEntryDraft("password", generateRandomPassword());
  }

  function startCreateEntry() {
    setSelectedEntryId(null);
    setEditingEntryId(null);
    setWorkspaceMode("create");
    setEntryDraft(EMPTY_ENTRY_DRAFT);
    setEntryErrors({});
    setVaultFeedback(null);
  }

  function selectEntry(entryId: string) {
    setSelectedEntryId(entryId);
    setEditingEntryId(null);
    setWorkspaceMode("view");
    setEntryDraft(EMPTY_ENTRY_DRAFT);
    setEntryErrors({});
    setVaultFeedback(null);
  }

  async function saveEntry(): Promise<string | null> {
    const validationErrors = validatePasswordEntry(entryDraft, entries, editingEntryId);

    if (Object.keys(validationErrors).length > 0) {
      setEntryErrors(validationErrors);
      setVaultFeedback(null);
      return null;
    }

    setIsSavingEntry(true);

    try {
      if (editingEntryId) {
        const updatedEntry = await updatePasswordEntry(editingEntryId, entryDraft);

        if (!updatedEntry) {
          setVaultFeedback({
            status: "error",
            message: "The selected entry is no longer available.",
          });
          setEditingEntryId(null);
          await loadEntries();
          return null;
        }

        await loadEntries(updatedEntry.id);
        setWorkspaceMode("view");
        setVaultFeedback({
          status: "success",
          message: "Entry updated successfully.",
        });
      } else {
        const createdEntry = await addPasswordEntry(entryDraft);
        await loadEntries(createdEntry.id);
        setWorkspaceMode("view");
        setVaultFeedback({
          status: "success",
          message: "Entry added successfully.",
        });
        setEntryDraft(EMPTY_ENTRY_DRAFT);
        setEntryErrors({});
        setEditingEntryId(null);
        return createdEntry.id;
      }

      setEntryDraft(EMPTY_ENTRY_DRAFT);
      setEntryErrors({});
      setEditingEntryId(null);
      return editingEntryId;
    } catch (error) {
      console.error("Failed to save vault entry.", error);
      setVaultFeedback({
        status: "error",
        message: "The entry could not be saved.",
      });
      return null;
    } finally {
      setIsSavingEntry(false);
    }
  }

  function editEntry(entry: PasswordEntry) {
    setEditingEntryId(entry.id);
    setSelectedEntryId(entry.id);
    setWorkspaceMode("edit");
    setEntryDraft({
      title: entry.title,
      username: entry.username,
      password: entry.password,
      url: entry.url,
      notes: entry.notes,
    });
    setEntryErrors({});
    setVaultFeedback(null);
  }

  function cancelEdit() {
    const hasSelectedEntry = entries.some((entry) => entry.id === selectedEntryId);
    setEditingEntryId(null);
    setWorkspaceMode(hasSelectedEntry ? "view" : "idle");
    setEntryDraft(EMPTY_ENTRY_DRAFT);
    setEntryErrors({});
    setVaultFeedback(null);
  }

  async function removeEntry(entryId: string) {
    setIsSavingEntry(true);

    try {
      const wasDeleted = await deletePasswordEntry(entryId);

      if (!wasDeleted) {
        setVaultFeedback({
          status: "error",
          message: "The selected entry is no longer available.",
        });
        await loadEntries();
        return;
      }

      if (editingEntryId === entryId) {
        cancelEdit();
      }

      await loadEntries(selectedEntryId === entryId ? null : selectedEntryId);
      setWorkspaceMode(entries.length > 1 ? "view" : "idle");
      setVaultFeedback({
        status: "success",
        message: "Entry deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete vault entry.", error);
      setVaultFeedback({
        status: "error",
        message: "The entry could not be deleted.",
      });
    } finally {
      setIsSavingEntry(false);
    }
  }

  const visibleEntries = useMemo(() => {
    return [...entries]
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
  }, [entries, filterOption, searchQuery, sortOption]);

  const selectedEntry =
    visibleEntries.find((entry) => entry.id === selectedEntryId) ??
    entries.find((entry) => entry.id === selectedEntryId) ??
    null;

  return {
    entries,
    visibleEntries,
    selectedEntry,
    workspaceMode,
    entryDraft,
    entryErrors,
    searchQuery,
    filterOption,
    sortOption,
    editingEntryId,
    isSavingEntry,
    isLoadingEntries,
    vaultFeedback,
    setSearchQuery,
    setFilterOption,
    setSortOption,
    selectEntry,
    startCreateEntry,
    updateEntryDraft,
    generatePassword,
    saveEntry,
    editEntry,
    cancelEdit,
    removeEntry,
  };
}
