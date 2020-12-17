export interface OneiamConfig {
  issuer: string;
  clientId: string;
  authenticateUri?: string;
  cookieName?: string;
  alternateOrigins?: string[];
  debug?: boolean;
}

export interface OneiamAuthenticateOptions {
  silent?: boolean;
  next?: string;
}

export type OneiamAuthenticateResult = "authenticate" | "authenticated" | "unauthenticated";

export interface OneiamSynchronizeOptions {
  requireAuthentication?: boolean; // default to false
  refreshOnChange?: boolean; // default to true
  next?: string;
  debug?: boolean;
}

export type OneiamSynchronizeResult = "noop" | "authenticate" | "authenticated" | "unauthenticated" | "disconnected";
