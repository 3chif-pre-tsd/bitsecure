import { useState } from "react";
import type { UserProfile } from "../models/auth";
import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../models/passwordEntry";
import DashboardHeader from "./vault/DashboardHeader";
import EntryDetailsPanel from "./vault/EntryDetailsPanel";
import EntryEditorPanel from "./vault/EntryEditorPanel";
import EntryListPanel from "./vault/EntryListPanel";

interface DashboardProps {
  user: UserProfile;
  entries: PasswordEntry[];
  filteredEntries: PasswordEntry[];
  selectedEntry: PasswordEntry | null;
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  filterQuery: string;
  editingEntryId: string | null;
  isSavingEntry: boolean;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onSaveEntry: () => void;
  onSelectEntry: (entryId: string) => void;
  onEditEntry: (entry: PasswordEntry) => void;
  onCancelEdit: () => void;
  onDeleteEntry: (entryId: string) => void;
  onFilterQueryChange: (value: string) => void;
  onLogout: () => void;
}

export default function Dashboard({
  user,
  entries,
  filteredEntries,
  selectedEntry,
  entryDraft,
  entryErrors,
  filterQuery,
  editingEntryId,
  isSavingEntry,
  onEntryDraftChange,
  onSaveEntry,
  onSelectEntry,
  onEditEntry,
  onCancelEdit,
  onDeleteEntry,
  onFilterQueryChange,
  onLogout,
}: DashboardProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader
          user={user}
          entryCount={entries.length}
          filteredCount={filteredEntries.length}
          selectedCount={selectedEntry ? 1 : 0}
          onLogout={onLogout}
        />

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr_1fr]">
          <EntryListPanel
            entries={filteredEntries}
            selectedEntryId={selectedEntry?.id ?? null}
            filterQuery={filterQuery}
            onFilterQueryChange={onFilterQueryChange}
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
            onSaveEntry={onSaveEntry}
            onCancelEdit={onCancelEdit}
          />
        </div>
      </div>
    </main>
  );
}
