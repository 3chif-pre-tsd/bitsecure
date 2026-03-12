import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../../models/passwordEntry";
import Button from "../ui/Button";
import { InputField, TextareaField } from "../ui/Field";
import Icon from "../ui/Icon";
import Panel from "../ui/Panel";

interface EntryEditorPanelProps {
  entries: PasswordEntry[];
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  editingEntryId: string | null;
  isSavingEntry: boolean;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onSaveEntry: () => void;
  onCancelEdit: () => void;
}

export default function EntryEditorPanel({
  entries,
  entryDraft,
  entryErrors,
  editingEntryId,
  isSavingEntry,
  onEntryDraftChange,
  onSaveEntry,
  onCancelEdit,
}: EntryEditorPanelProps) {
  return (
    <Panel
      eyebrow="Editor"
      title={editingEntryId ? "Edit entry" : "Add entry"}
      description={
        editingEntryId
          ? "Adjust the selected credential and save the encrypted changes."
          : "Create a new vault entry with title, username, password, URL, and notes."
      }
      action={
        <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Entries</p>
          <p className="text-lg font-semibold text-slate-900">{entries.length}</p>
        </div>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void onSaveEntry();
        }}
        noValidate
      >
        <InputField
          id="entry-title"
          label="Title"
          value={entryDraft.title}
          onChange={(event) => onEntryDraftChange("title", event.target.value)}
          placeholder="GitHub"
          error={entryErrors.title}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="entry-username"
            label="Username"
            value={entryDraft.username}
            onChange={(event) => onEntryDraftChange("username", event.target.value)}
            placeholder="octocat"
            error={entryErrors.username}
          />
          <InputField
            id="entry-password"
            type="password"
            label="Password"
            value={entryDraft.password}
            onChange={(event) => onEntryDraftChange("password", event.target.value)}
            placeholder="Password"
            error={entryErrors.password}
          />
        </div>

        <InputField
          id="entry-url"
          type="url"
          label="URL"
          value={entryDraft.url}
          onChange={(event) => onEntryDraftChange("url", event.target.value)}
          placeholder="https://example.com"
          error={entryErrors.url}
        />

        <TextareaField
          id="entry-notes"
          label="Notes"
          value={entryDraft.notes}
          onChange={(event) => onEntryDraftChange("notes", event.target.value)}
          placeholder="Optional notes"
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {editingEntryId ? (
            <Button variant="secondary" onClick={onCancelEdit} disabled={isSavingEntry}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={isSavingEntry}>
            <Icon name={editingEntryId ? "edit" : "plus"} className="size-4" />
            {isSavingEntry ? "Saving..." : editingEntryId ? "Save changes" : "Add entry"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}
