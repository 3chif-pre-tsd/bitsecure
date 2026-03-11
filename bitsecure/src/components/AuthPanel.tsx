import type { AuthResult } from "../models/auth";

interface AuthPanelProps {
  hasMasterPassword: boolean;
  draftPassword: string;
  isSubmitting: boolean;
  authResult: AuthResult | null;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export default function AuthPanel({
  hasMasterPassword,
  draftPassword,
  isSubmitting,
  authResult,
  onPasswordChange,
  onSubmit,
}: AuthPanelProps) {
  const title = hasMasterPassword ? "Unlock your vault" : "Create your master password";
  const description = hasMasterPassword
    ? "Use your master password to access BitSecure."
    : "Set the password that will protect your vault locally in this browser.";
  const buttonLabel = isSubmitting
    ? "Please wait..."
    : hasMasterPassword
      ? "Login"
      : "Save master password";

  return (
    <section className="panel auth-panel">
      <div className="panel-heading">
        <span className="eyebrow">Sprint 1</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <label className="field">
        <span>Master password</span>
        <input
          type="password"
          value={draftPassword}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Enter your master password"
          autoComplete="current-password"
        />
      </label>

      {authResult ? (
        <p className={`status-message ${authResult.status}`}>{authResult.message}</p>
      ) : null}

      <button type="button" className="primary-button" onClick={onSubmit} disabled={isSubmitting}>
        {buttonLabel}
      </button>
    </section>
  );
}
