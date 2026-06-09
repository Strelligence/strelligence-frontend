/**
 * store/auth.store.ts
 *
 * Global auth state. Persisted to sessionStorage so the user stays
 * connected on page refresh (until they disconnect explicitly).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  connectStellarWallet,
  disconnectStellarWallet,
  getConnectedAddress,
  getSupportedStellarWallets,
  hasInstalledStellarWallet,
} from "@/lib/stellar-wallet";
import type { AuthState } from "@/types/wallet";

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      address: null,
      network: null,
      walletName: null,
      supportedWallets: [],
      jwt: null,
      status: "idle",
      error: null,
      hasStellarWallet: false,

      /** Check if a supported Stellar wallet is installed and restore address */
      checkStellarWallets: async () => {
        set({ status: "checking" });
        const supportedWallets = await getSupportedStellarWallets();
        const hasWallet = await hasInstalledStellarWallet();
        set({ hasStellarWallet: hasWallet, supportedWallets });

        if (!hasWallet) {
          set({ status: "disconnected" });
          return;
        }

        const address = await getConnectedAddress();
        if (address) {
          set({ address, status: "connected" });
          return;
        }

        set({ status: "idle" });
      },

      /** Full connect flow — opens Stellar Wallets Kit modal */
      connect: async () => {
        set({ status: "connecting", error: null });

        try {
          const result = await connectStellarWallet();
          set({
            address: result.address,
            network: result.network,
            walletName: result.walletName ?? null,
            status: "connected",
            error: null,
          });
          return result.address;
        } catch (err) {
          const errorMessages: Record<string, string> = {
            NOT_INSTALLED:
              "No supported Stellar wallet was found in this browser. Please install a Stellar wallet extension.",
            USER_REJECTED:
              "Connection was rejected. Please approve the request in your Stellar wallet.",
            NOT_ALLOWED:
              "Access denied. Please allow Strelligence in your Stellar wallet settings.",
            WRONG_NETWORK:
              "Wrong network selected. Please switch to Stellar Mainnet in your wallet.",
            UNKNOWN: "An unexpected error occurred. Please try again.",
          };

          const message =
            errorMessages[err as string] ??
            "Connection failed. Please try again.";

          set({
            status: "error",
            error: message,
            address: null,
            network: null,
            walletName: null,
          });
          return null;
        }
      },

      /** Disconnect and clear all state */
      disconnect: () => {
        disconnectStellarWallet();
        set({
          address: null,
          network: null,
          walletName: null,
          jwt: null,
          status: "disconnected",
          error: null,
        });
      },

      /** Called after backend issues a JWT */
      setJwt: (token) => set({ jwt: token }),

      /** Called by the wallet watcher when address changes */
      setAddress: (address) => {
        const current = get().address;
        // If the user switched accounts, force re-auth
        if (current && current !== address) {
          set({ address, jwt: null });
        } else {
          set({ address });
        }
      },

      /** Called by the wallet watcher when network changes */
      setNetwork: (network) => {
        // Network change invalidates JWT
        set((state) => ({
          network: state.network ? { ...state.network, network } : null,
          jwt: null,
        }));
      },
    }),
    {
      name: "strelligence-auth",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist these fields — never persist status/error
      partialize: (state) => ({
        address: state.address,
        network: state.network,
        walletName: state.walletName,
        jwt: state.jwt,
      }),
    }
  )
);
