export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
}

export interface PasswordEntryInput {
  title: string;
  username: string;
  password: string;
  url: string;
}

export interface PasswordEntryValidationErrors {
  title?: string;
  username?: string;
  password?: string;
  url?: string;
}
