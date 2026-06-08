/**
 * lib/freighter.ts
 *
 * All direct interactions with the Freighter browser extension live here.
 * Never import @stellar/freighter-api outside of this file — everything
 * else in the app goes through these typed helpers.
 */

import {
  isConnected,
  isAllowed,
  getAddress,
  signTransaction,
  signAuthEntry,
  requestAccess,
  setAllowed,
  getNetwork,
  getNetworkDetails,
  WatchWalletChanges,
} from "@stellar/freighter-api";
import type {
  FreighterNetwork,
  FreighterConnectionResult,
  FreighterError,
} from "@/types/wallet";

// ─── Re-export types for backward compatibility ────────────────────────────

export type { FreighterNetwork, FreighterConnectionResult, FreighterError };

// ─── Detection ───────────────────────────────────────────────────────────────

/**
 * Returns true if the Freighter extension is installed in the browser.
 * Safe to call on page load — throws nothing.
 */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}

/**
 * Returns true if the user has already granted this site access.
 */
export async function isFreighterAllowed(): Promise<boolean> {
  try {
    const result = await isAllowed();
    return result.isAllowed;
  } catch {
    return false;
  }
}

// ─── Connection ───────────────────────────────────────────────────────────────

/**
 * Full connection flow:
 * 1. Check extension is installed
 * 2. Request access (opens Freighter popup if needed)
 * 3. Read the connected address and network
 *
 * Throws a typed FreighterError string on failure.
 */
export async function connectFreighter(): Promise<FreighterConnectionResult> {
  // Step 1 — Is the extension installed?
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw "NOT_INSTALLED" as FreighterError;
  }

  // Step 2 — Request access (shows popup if not already allowed)
  const accessResult = await requestAccess();
  if (accessResult.error) {
    // User closed the popup or denied
    throw "USER_REJECTED" as FreighterError;
  }

  // Step 3 — Read address
  const addressResult = await getAddress();
  if (addressResult.error || !addressResult.address) {
    throw "NOT_ALLOWED" as FreighterError;
  }

  // Step 4 — Read network info
  const networkDetails = await getNetworkDetails();
  if (networkDetails.error) {
    throw "UNKNOWN" as FreighterError;
  }

  return {
    address: addressResult.address,
    network: {
      network: networkDetails.network,
      networkUrl: networkDetails.networkUrl,
      networkPassphrase: networkDetails.networkPassphrase,
    },
  };
}

/**
 * Just fetch the currently connected address without re-requesting access.
 * Returns null if not connected.
 */
export async function getConnectedAddress(): Promise<string | null> {
  try {
    const result = await getAddress();
    return result.address ?? null;
  } catch {
    return null;
  }
}

/**
 * Get current network details.
 */
export async function getConnectedNetwork(): Promise<FreighterNetwork | null> {
  try {
    const result = await getNetworkDetails();
    if (result.error) return null;
    return {
      network: result.network,
      networkUrl: result.networkUrl,
      networkPassphrase: result.networkPassphrase,
    };
  } catch {
    return null;
  }
}

// ─── Signing ─────────────────────────────────────────────────────────────────

/**
 * Sign an XDR transaction envelope via Freighter.
 * Used when submitting on-chain transactions.
 */
export async function signTx(
  xdr: string,
  networkPassphrase: string,
  address: string
): Promise<string> {
  const result = await signTransaction(xdr, {
    networkPassphrase,
    address,
  });
  if (result.error) {
    throw new Error(`Freighter sign error: ${result.error}`);
  }
  return result.signedTxXdr;
}

/**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
 * Sign an auth entry for Soroban contract authorization.
 */
export async function signAuth(                                                 
  authEntry: string,
  networkPassphrase: string,
  address: string
): Promise<string> {
  const result = await signAuthEntry(authEntry, {
    networkPassphrase,
    address,
  });

  if (result.error) {
    throw new Error(`Freighter auth sign error: ${result.error}`);
  }

  if (!result.signedAuthEntry) {
    throw new Error("Freighter returned no signed auth entry");
  }

  return result.signedAuthEntry;
}

// ─── Challenge Signing (for JWT auth) ─────────────────────────────────────────

/**
 * Converts a UTF-8 challenge string to XDR-like base64 for signing.
 *
 * The backend issues a challenge message. We sign it as a transaction memo
 * (or as raw bytes on newer Freighter versions). This simplified approach
 * creates a minimal XDR envelope that Freighter can sign.
 *
 * For production, use SEP-10 properly. This is the dev-friendly version.
 */
export function encodeChallenge(challenge: string): string {
  return btoa(challenge);
}

// ─── Wallet Change Watcher ────────────────────────────────────────────────────

/**
 * Watch for wallet/account/network changes in Freighter.
 * Call this once on app mount to keep the store in sync.
 *
 * Returns a cleanup function — call it on unmount.
 */
export function watchFreighterChanges(
  onAddressChange: (address: string) => void,
  onNetworkChange: (network: string) => void
): () => void {
  const watcher = new WatchWalletChanges(3000); // poll every 3s

  watcher.watch((data) => {
    if (data.address) onAddressChange(data.address);
    if (data.network) onNetworkChange(data.network);
  });

  return () => watcher.stop();
}