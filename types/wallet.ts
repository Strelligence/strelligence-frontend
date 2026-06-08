/**
 * types/wallet.ts
 *
 * Centralized wallet and authentication types.
 * All wallet-related types are defined here for better organization.
 */

// ─── Freighter Types ──────────────────────────────────────────────────────────

export interface FreighterNetwork {
  network: string;         // e.g. "MAINNET" | "TESTNET"
  networkUrl: string;      // Horizon URL
  networkPassphrase: string;
}

export interface FreighterConnectionResult {
  address: string;
  network: FreighterNetwork;
}

export type FreighterError =
  | "NOT_INSTALLED"
  | "USER_REJECTED"
  | "NOT_ALLOWED"
  | "WRONG_NETWORK"
  | "UNKNOWN";

// ─── Authentication Store Types ──────────────────────────────────────────────

export type ConnectionStatus =
  | "idle"
  | "checking"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface AuthState {
  // Wallet data
  address: string | null;
  network: FreighterNetwork | null;

  // JWT from backend (set after /auth/connect-wallet succeeds)
  jwt: string | null;

  // UI status
  status: ConnectionStatus;
  error: string | null;

  // Freighter detection
  isFreighterInstalled: boolean;

  // Actions
  checkFreighter: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
  setJwt: (token: string) => void;
  setAddress: (address: string) => void;
  setNetwork: (network: string) => void;
}
