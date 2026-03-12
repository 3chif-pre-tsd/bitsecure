export type PasswordEntryFilterOption = "all" | "with-url" | "with-notes";
export type PasswordEntrySortOption = "updated-desc" | "created-desc" | "title-asc";

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordEntryInput {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

export interface PasswordEntryValidationErrors {
  title?: string;
  username?: string;
  password?: string;
  url?: string;
}

export interface StoredEncryptedEntries {
  iv: string;
  payload: string;
}
