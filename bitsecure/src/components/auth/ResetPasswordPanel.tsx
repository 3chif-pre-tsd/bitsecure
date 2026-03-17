import type { AuthResult } from "../../models/auth";
import Button from "../ui/Button";
import FeedbackMessage from "../ui/FeedbackMessage";
import { InputField } from "../ui/Field";
import Icon from "../ui/Icon";
import Panel from "../ui/Panel";

interface ResetPasswordPanelProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  currentPasswordError?: string;
  newPasswordError?: string;
  confirmPasswordError?: string;
  isSubmitting: boolean;
  resetResult: AuthResult | null;
  onChange: (
    field: "currentPassword" | "newPassword" | "confirmPassword",
    value: string,
  ) => void;
  onSubmit: () => void;
}

export default function ResetPasswordPanel({
  currentPassword,
  newPassword,
  confirmPassword,
  currentPasswordError,
  newPasswordError,
  confirmPasswordError,
  isSubmitting,
  resetResult,
  onChange,
  onSubmit,
}: ResetPasswordPanelProps) {
  return (
    <Panel
      eyebrow="Account security"
      title="Reset master password"
      description="Verify the current password, set a new one, and keep the vault re-encrypted under the updated credentials."
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}
      >
        <InputField
          id="current-master-password"
          type="password"
          label="Current master password"
          value={currentPassword}
          onChange={(event) => onChange("currentPassword", event.target.value)}
          error={currentPasswordError}
        />
        <InputField
          id="new-master-password"
          type="password"
          label="New master password"
          value={newPassword}
          onChange={(event) => onChange("newPassword", event.target.value)}
          error={newPasswordError}
        />
        <InputField
          id="confirm-master-password"
          type="password"
          label="Confirm new master password"
          value={confirmPassword}
          onChange={(event) => onChange("confirmPassword", event.target.value)}
          error={confirmPasswordError}
        />

        {resetResult ? <FeedbackMessage status={resetResult.status} message={resetResult.message} /> : null}

        <Button type="submit" disabled={isSubmitting}>
          <Icon name="vault" className="size-4" />
          {isSubmitting ? "Updating..." : "Update master password"}
        </Button>
      </form>
    </Panel>
  );
}
