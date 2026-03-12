export type AuthStatus = "success" | "error";

export interface AuthResult {
  status: AuthStatus;
  message: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface ResetMasterPasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface StoredAccount {
  salt: string;
  usernameIv: string;
  usernamePayload: string;
  verifierIv: string;
  verifierPayload: string;
}

export interface UserProfile {
  username: string;
}
