import { Navigate, createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthPanel from "../components/AuthPanel";
import { useAppState } from "../state/AppStateContext";

function LoginPage() {
  const navigate = useNavigate();
  const { auth } = useAppState();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthPanel
      hasAccount={auth.hasAccount}
      draftPassword={auth.draftPassword}
      draftConfirmPassword={auth.draftConfirmPassword}
      passwordError={auth.authErrors.password}
      confirmPasswordError={auth.authErrors.confirmPassword}
      isSubmitting={auth.isSubmitting}
      authResult={auth.authResult}
      onPasswordChange={auth.setDraftPassword}
      onConfirmPasswordChange={auth.setDraftConfirmPassword}
      onSubmit={async () => {
        const wasSuccessful = await auth.submitAuth();

        if (wasSuccessful) {
          await navigate({ to: "/dashboard" });
        }
      }}
      onResetLocalVault={auth.resetLocalVault}
    />
  );
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
