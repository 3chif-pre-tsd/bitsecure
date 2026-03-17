import { useEffect, useState } from "react";
import type { AuthResult } from "../models/auth";
import { validateMasterPassword } from "../services/auth/authValidation";
import {
  clearActiveEncryptionKey,
  hasConfiguredAccount,
  initializeMasterPassword,
  login,
  resetMasterPassword,
} from "../services/auth/masterPasswordService";

const EMPTY_RESET_DRAFT = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const EMPTY_AUTH_ERRORS = {
  password: undefined,
  confirmPassword: undefined,
};

export function useAuth() {
  const [hasAccount, setHasAccount] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [draftPassword, setDraftPassword] = useState("");
  const [draftConfirmPassword, setDraftConfirmPassword] = useState("");
  const [authErrors, setAuthErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>(EMPTY_AUTH_ERRORS);
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

  function updateDraftPassword(value: string) {
    setDraftPassword(value);
    setAuthErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
    }));
    setAuthResult(null);
  }

  function updateDraftConfirmPassword(value: string) {
    setDraftConfirmPassword(value);
    setAuthErrors((currentErrors) => ({
      ...currentErrors,
      confirmPassword: undefined,
    }));
    setAuthResult(null);
  }

  async function submitAuth(): Promise<boolean> {
    const nextErrors = { ...EMPTY_AUTH_ERRORS };
    const validationMessage = validateMasterPassword({
      password: draftPassword,
    });

    if (validationMessage) {
      nextErrors.password = validationMessage;
    }

    if (!hasAccount && draftConfirmPassword !== draftPassword) {
      nextErrors.confirmPassword = "Confirmation must match the master password.";
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setAuthErrors(nextErrors);
      setAuthResult(null);
      return false;
    }

    setIsSubmitting(true);

    try {
      const result = hasAccount
        ? await login({
            password: draftPassword,
          })
        : await initializeMasterPassword({
            password: draftPassword,
          });

      setAuthResult(result);

      if (result.status !== "success") {
        return false;
      }

      setHasAccount(true);
      setIsAuthenticated(true);
      setDraftPassword("");
      setDraftConfirmPassword("");
      setAuthErrors(EMPTY_AUTH_ERRORS);

      return true;
    } finally {
      setIsSubmitting(false);
    }
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
    setResetResult(null);
  }

  async function submitResetMasterPassword() {
    const nextErrors: typeof resetErrors = {};

    if (!resetDraft.currentPassword.trim()) {
      nextErrors.currentPassword = "Current master password is required.";
    }

    const newPasswordValidation = validateMasterPassword({
      password: resetDraft.newPassword,
    });

    if (newPasswordValidation) {
      nextErrors.newPassword = newPasswordValidation;
    }

    if (resetDraft.newPassword === resetDraft.currentPassword && resetDraft.newPassword.trim()) {
      nextErrors.newPassword = "New master password must be different.";
    }

    if (resetDraft.confirmPassword !== resetDraft.newPassword) {
      nextErrors.confirmPassword = "Confirmation must match the new master password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setResetErrors(nextErrors);
      setResetResult(null);
      return;
    }

    setIsResettingPassword(true);

    try {
      const result = await resetMasterPassword({
        currentPassword: resetDraft.currentPassword,
        newPassword: resetDraft.newPassword,
      });
      setResetResult(result);

      if (result.status === "success") {
        setResetDraft(EMPTY_RESET_DRAFT);
        setResetErrors({});
      }
    } finally {
      setIsResettingPassword(false);
    }
  }

  function logout() {
    clearActiveEncryptionKey();
    setIsAuthenticated(false);
    setDraftPassword("");
    setDraftConfirmPassword("");
    setAuthErrors(EMPTY_AUTH_ERRORS);
    setAuthResult(null);
    setResetDraft(EMPTY_RESET_DRAFT);
    setResetErrors({});
    setResetResult(null);
  }

  return {
    hasAccount,
    isAuthenticated,
    draftPassword,
    draftConfirmPassword,
    authErrors,
    isSubmitting,
    authResult,
    resetDraft,
    resetErrors,
    isResettingPassword,
    resetResult,
    setDraftPassword: updateDraftPassword,
    setDraftConfirmPassword: updateDraftConfirmPassword,
    submitAuth,
    updateResetDraft,
    submitResetMasterPassword,
    logout,
  };
}
