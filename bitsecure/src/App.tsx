import AuthPanel from "./components/AuthPanel";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./hooks/useAuth";
import { useVault } from "./hooks/useVault";

export default function App() {
  const auth = useAuth();
  const vault = useVault(auth.isAuthenticated);

  if (!auth.isAuthenticated) {
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
        onSubmit={() => {
          void auth.submitAuth();
        }}
      />
    );
  }

  return (
    <Dashboard
      entries={vault.entries}
      visibleEntries={vault.visibleEntries}
      selectedEntry={vault.selectedEntry}
      entryDraft={vault.entryDraft}
      entryErrors={vault.entryErrors}
      searchQuery={vault.searchQuery}
      filterOption={vault.filterOption}
      sortOption={vault.sortOption}
      editingEntryId={vault.editingEntryId}
      isSavingEntry={vault.isSavingEntry}
      isLoadingEntries={vault.isLoadingEntries}
      vaultFeedback={vault.vaultFeedback}
      resetDraft={auth.resetDraft}
      resetErrors={auth.resetErrors}
      isResettingPassword={auth.isResettingPassword}
      resetResult={auth.resetResult}
      onEntryDraftChange={vault.updateEntryDraft}
      onGeneratePassword={vault.generatePassword}
      onSaveEntry={() => {
        void vault.saveEntry();
      }}
      onSelectEntry={vault.setSelectedEntryId}
      onEditEntry={vault.editEntry}
      onCancelEdit={vault.cancelEdit}
      onDeleteEntry={(entryId) => {
        void vault.removeEntry(entryId);
      }}
      onSearchQueryChange={vault.setSearchQuery}
      onFilterOptionChange={vault.setFilterOption}
      onSortOptionChange={vault.setSortOption}
      onResetDraftChange={auth.updateResetDraft}
      onResetMasterPassword={() => {
        void auth.submitResetMasterPassword();
      }}
      onLogout={auth.logout}
    />
  );
}
