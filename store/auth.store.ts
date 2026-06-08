/**
 * store/auth.store.ts
 *
 * Global auth state. Persisted to sessionStorage so the user stays
 * connected on page refresh (until they disconnect explicitly).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  connectFreighter,
  isFreighterInstalled,
  isFreighterAllowed,
  getConnectedAddress,
  watchFreighterChanges,
  FreighterNetwork,
} from "@/lib/freighter";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConnectionStatus =
  | "idle"
  | "checking"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface AuthState {
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

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      address: null,
      network: null,
      jwt: null,
      status: "idle",
      error: null,
      isFreighterInstalled: false,

      /** Check if Freighter is installed and already connected */
      checkFreighter: async () => {
        set({ status: "checking" });
        const installed = await isFreighterInstalled();
        set({ isFreighterInstalled: installed });

        if (!installed) {
          set({ status: "disconnected" });
          return;
        }

        // If already allowed, restore address silently
        const allowed = await isFreighterAllowed();
        if (allowed) {
          const address = await getConnectedAddress();
          if (address) {
            set({ address, status: "connected" });
            return;
          }
        }

        set({ status: "idle" });
      },

      /** Full connect flow — opens Freighter popup */
      connect: async () => {
        set({ status: "connecting", error: null });

        try {
          const result = await connectFreighter();
          set({
            address: result.address,
            network: result.network,
            status: "connected",
            error: null,
          });
        } catch (err) {
          const errorMessages: Record<string, string> = {
            NOT_INSTALLED:
              "Freighter wallet is not installed. Please install it from freighter.app",
            USER_REJECTED:
              "Connection was rejected. Please approve the request in Freighter.",
            NOT_ALLOWED:
              "Access denied. Please allow Strelligence in Freighter settings.",
            WRONG_NETWORK:
              "Wrong network selected. Please switch to Stellar Mainnet in Freighter.",
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
          });
        }
      },

      /** Disconnect and clear all state */
      disconnect: () => {
        set({
          address: null,
          network: null,
          jwt: null,
          status: "disconnected",
          error: null,
        });
      },

      /** Called after backend issues a JWT */
      setJwt: (token) => set({ jwt: token }),

      /** Called by the Freighter watcher when address changes */
      setAddress: (address) => {
        const current = get().address;
        // If the user switched accounts, force re-auth
        if (current && current !== address) {
          set({ address, jwt: null });
        } else {
          set({ address });
        }
      },

      /** Called by the Freighter watcher when network changes */
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
        jwt: state.jwt,
      }),
    }
  )
);