import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../../models/passwordEntry";
import Button from "../ui/Button";
import { InputField, TextareaField } from "../ui/Field";
import FeedbackMessage from "../ui/FeedbackMessage";
import Icon from "../ui/Icon";
import Panel from "../ui/Panel";

interface EntryEditorPanelProps {
  entries: PasswordEntry[];
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  editingEntryId: string | null;
  isSavingEntry: boolean;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onGeneratePassword: () => void;
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
  onGeneratePassword,
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
        <div className="inline-flex min-w-fit items-center whitespace-nowrap rounded-2xl bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-700">
          {entries.length} entries
        </div>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveEntry();
        }}
        noValidate
      >
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          * required fields
        </p>

        {entryErrors.form ? (
          <FeedbackMessage status="error" message={entryErrors.form} />
        ) : null}

        <InputField
          id="entry-title"
          label="Title"
          required
          aria-required="true"
          value={entryDraft.title}
          onChange={(event) => onEntryDraftChange("title", event.target.value)}
          placeholder="GitHub"
          error={entryErrors.title}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="entry-username"
            label="Username"
            required
            aria-required="true"
            value={entryDraft.username}
            onChange={(event) => onEntryDraftChange("username", event.target.value)}
            placeholder="octocat"
            error={entryErrors.username}
          />
          <div className="space-y-2">
            <InputField
              id="entry-password"
              type="text"
              label="Password"
              required
              aria-required="true"
              value={entryDraft.password}
              onChange={(event) => onEntryDraftChange("password", event.target.value)}
              placeholder="Password"
              error={entryErrors.password}
              hint="Generate a strong random password when needed."
            />
            <Button className="w-full sm:w-auto" variant="secondary" onClick={onGeneratePassword}>
              <Icon name="plus" className="size-4" />
              Generate random password
            </Button>
          </div>
        </div>

        <InputField
          id="entry-url"
          type="url"
          label="URL"
          optional
          value={entryDraft.url}
          onChange={(event) => onEntryDraftChange("url", event.target.value)}
          placeholder="https://example.com"
          error={entryErrors.url}
        />

        <TextareaField
          id="entry-notes"
          label="Notes"
          optional
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
