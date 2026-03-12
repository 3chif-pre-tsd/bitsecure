import { useState } from "react";
import type { AuthResult, UserProfile } from "../models/auth";
import type {
  PasswordEntry,
  PasswordEntryFilterOption,
  PasswordEntryInput,
  PasswordEntrySortOption,
  PasswordEntryValidationErrors,
} from "../models/passwordEntry";
import ResetPasswordPanel from "./auth/ResetPasswordPanel";
import DashboardHeader from "./vault/DashboardHeader";
import EntryDetailsPanel from "./vault/EntryDetailsPanel";
import EntryEditorPanel from "./vault/EntryEditorPanel";
import EntryListPanel from "./vault/EntryListPanel";

interface DashboardProps {
  user: UserProfile;
  entries: PasswordEntry[];
  visibleEntries: PasswordEntry[];
  selectedEntry: PasswordEntry | null;
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  searchQuery: string;
  filterOption: PasswordEntryFilterOption;
  sortOption: PasswordEntrySortOption;
  editingEntryId: string | null;
  isSavingEntry: boolean;
  resetDraft: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  resetErrors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  isResettingPassword: boolean;
  resetResult: AuthResult | null;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onGeneratePassword: () => void;
  onSaveEntry: () => void;
  onSelectEntry: (entryId: string) => void;
  onEditEntry: (entry: PasswordEntry) => void;
  onCancelEdit: () => void;
  onDeleteEntry: (entryId: string) => void;
  onSearchQueryChange: (value: string) => void;
  onFilterOptionChange: (value: PasswordEntryFilterOption) => void;
  onSortOptionChange: (value: PasswordEntrySortOption) => void;
  onResetDraftChange: (
    field: "currentPassword" | "newPassword" | "confirmPassword",
    value: string,
  ) => void;
  onResetMasterPassword: () => void;
  onLogout: () => void;
}

export default function Dashboard({
  user,
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
  resetDraft,
  resetErrors,
  isResettingPassword,
  resetResult,
  onEntryDraftChange,
  onGeneratePassword,
  onSaveEntry,
  onSelectEntry,
  onEditEntry,
  onCancelEdit,
  onDeleteEntry,
  onSearchQueryChange,
  onFilterOptionChange,
  onSortOptionChange,
  onResetDraftChange,
  onResetMasterPassword,
  onLogout,
}: DashboardProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader
          user={user}
          entryCount={entries.length}
          filteredCount={visibleEntries.length}
          selectedCount={selectedEntry ? 1 : 0}
          onLogout={onLogout}
        />

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr_1fr]">
          <EntryListPanel
            entries={visibleEntries}
            selectedEntryId={selectedEntry?.id ?? null}
            searchQuery={searchQuery}
            filterOption={filterOption}
            sortOption={sortOption}
            onSearchQueryChange={onSearchQueryChange}
            onFilterOptionChange={onFilterOptionChange}
            onSortOptionChange={onSortOptionChange}
            onSelectEntry={onSelectEntry}
            onResetPasswordVisibility={() => setIsPasswordVisible(false)}
          />

          <EntryDetailsPanel
            entry={selectedEntry}
            isPasswordVisible={isPasswordVisible}
            isSavingEntry={isSavingEntry}
            onTogglePasswordVisibility={() => setIsPasswordVisible((currentValue) => !currentValue)}
            onEditEntry={onEditEntry}
            onDeleteEntry={onDeleteEntry}
          />

          <EntryEditorPanel
            entries={entries}
            entryDraft={entryDraft}
            entryErrors={entryErrors}
            editingEntryId={editingEntryId}
            isSavingEntry={isSavingEntry}
            onEntryDraftChange={onEntryDraftChange}
            onGeneratePassword={onGeneratePassword}
            onSaveEntry={onSaveEntry}
            onCancelEdit={onCancelEdit}
          />
        </div>

        <ResetPasswordPanel
          currentPassword={resetDraft.currentPassword}
          newPassword={resetDraft.newPassword}
          confirmPassword={resetDraft.confirmPassword}
          currentPasswordError={resetErrors.currentPassword}
          newPasswordError={resetErrors.newPassword}
          confirmPasswordError={resetErrors.confirmPassword}
          isSubmitting={isResettingPassword}
          resetResult={resetResult}
          onChange={onResetDraftChange}
          onSubmit={onResetMasterPassword}
        />
      </div>
    </main>
  );
}
