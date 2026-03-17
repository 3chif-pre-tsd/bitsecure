export type AuthStatus = "success" | "error";

export interface AuthResult {
  status: AuthStatus;
  message: string;
}

export interface MasterPasswordCredentials {
  password: string;
}

export interface ResetMasterPasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface StoredAccount {
  salt: string;
  verifierIv: string;
  verifierPayload: string;
}
