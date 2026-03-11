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
  const title = hasMasterPassword ? "Login" : "Create master password";
  const description = hasMasterPassword
    ? "Enter your master password to continue to the dashboard."
    : "Set a master password to enable the basic authentication flow.";
  const buttonLabel = isSubmitting
    ? "Please wait..."
    : hasMasterPassword
      ? "Login"
      : "Save master password";

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-2">{title}</h1>
              <p className="text-body-secondary mb-4">{description}</p>

              <div className="mb-3">
                <label htmlFor="master-password" className="form-label">
                  Master password
                </label>
                <input
                  id="master-password"
                  type="password"
                  className="form-control"
                  value={draftPassword}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="Enter your master password"
                  autoComplete="current-password"
                />
              </div>

              {authResult ? (
                <div
                  className={`alert ${authResult.status === "success" ? "alert-success" : "alert-danger"}`}
                  role="alert"
                >
                  {authResult.message}
                </div>
              ) : null}

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
