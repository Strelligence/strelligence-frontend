/**
 * types/wallet.ts
 *
 * Centralized wallet and authentication types.
 * All wallet-related types are defined here for better organization.
 */

// ─── Stellar Wallet Types ────────────────────────────────────────────────────

export interface StellarNetwork {
  network: string;         // e.g. "Public Global Stellar Network ; September 2015"
  networkUrl?: string;     // Horizon URL, when the wallet exposes or we can infer it
  networkPassphrase: string;
}

export interface StellarConnectionResult {
  address: string;
  network: StellarNetwork | null;
  walletId?: string;
  walletName?: string;
}

export type StellarWalletError =
  | "NOT_INSTALLED"
  | "USER_REJECTED"
  | "NOT_ALLOWED"
  | "WRONG_NETWORK"
  | "UNKNOWN";

export interface StellarSupportedWallet {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
  isPlatformWrapper: boolean;
  icon: string;
  url: string;
}

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
  network: StellarNetwork | null;
  walletName: string | null;
  supportedWallets: StellarSupportedWallet[];

  // JWT from backend (set after /auth/connect-wallet succeeds)
  jwt: string | null;

  // UI status
  status: ConnectionStatus;
  error: string | null;

  // Stellar wallet detection
  hasStellarWallet: boolean;

  // Actions
  checkStellarWallets: () => Promise<void>;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  setJwt: (token: string) => void;
  setAddress: (address: string) => void;
  setNetwork: (network: string) => void;
}
