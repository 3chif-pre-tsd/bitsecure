import { useEffect, useState } from "react";
import type { AuthResult, UserProfile } from "../models/auth";
import {
  clearActiveEncryptionKey,
  getActiveUserProfile,
  hasConfiguredAccount,
  login,
  registerAccount,
  resetMasterPassword,
} from "../services/auth/masterPasswordService";

const EMPTY_RESET_DRAFT = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function useAuth() {
  const [hasAccount, setHasAccount] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [draftUsername, setDraftUsername] = useState("");
  const [draftPassword, setDraftPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [resetDraft, setResetDraft] = useState(EMPTY_RESET_DRAFT);
  const [resetErrors, setResetErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetResult, setResetResult] = useState<AuthResult | null>(null);

  useEffect(() => {
    setHasAccount(hasConfiguredAccount());
  }, []);

  async function submitAuth(): Promise<boolean> {
    setIsSubmitting(true);

    const result = hasAccount
      ? await login({
          username: draftUsername,
          password: draftPassword,
        })
      : await registerAccount({
          username: draftUsername,
          password: draftPassword,
        });

    setAuthResult(result);
    setIsSubmitting(false);

    if (result.status !== "success") {
      return false;
    }

    setHasAccount(true);
    setIsAuthenticated(true);
    setDraftPassword("");
    setCurrentUser(getActiveUserProfile());

    return true;
  }

  function updateResetDraft(
    field: "currentPassword" | "newPassword" | "confirmPassword",
    value: string,
  ) {
    setResetDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
    setResetErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  async function submitResetMasterPassword() {
    const nextErrors: typeof resetErrors = {};

    if (!resetDraft.currentPassword.trim()) {
      nextErrors.currentPassword = "Current master password is required.";
    }

    if (!resetDraft.newPassword.trim()) {
      nextErrors.newPassword = "New master password is required.";
    }

    if (resetDraft.newPassword === resetDraft.currentPassword && resetDraft.newPassword.trim()) {
      nextErrors.newPassword = "New master password must be different.";
    }

    if (resetDraft.confirmPassword !== resetDraft.newPassword) {
      nextErrors.confirmPassword = "Confirmation must match the new password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setResetErrors(nextErrors);
      return;
    }

    setIsResettingPassword(true);
    const result = await resetMasterPassword({
      currentPassword: resetDraft.currentPassword,
      newPassword: resetDraft.newPassword,
    });
    setResetResult(result);
    setIsResettingPassword(false);

    if (result.status === "success") {
      setResetDraft(EMPTY_RESET_DRAFT);
      setResetErrors({});
    }
  }

  function logout() {
    clearActiveEncryptionKey();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setDraftUsername("");
    setDraftPassword("");
    setAuthResult(null);
    setResetDraft(EMPTY_RESET_DRAFT);
    setResetErrors({});
    setResetResult(null);
  }

  return {
    hasAccount,
    isAuthenticated,
    currentUser,
    draftUsername,
    draftPassword,
    isSubmitting,
    authResult,
    resetDraft,
    resetErrors,
    isResettingPassword,
    resetResult,
    setDraftUsername,
    setDraftPassword,
    submitAuth,
    updateResetDraft,
    submitResetMasterPassword,
    logout,
  };
}
