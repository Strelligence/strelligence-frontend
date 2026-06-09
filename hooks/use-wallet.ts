/**
 * The primary hook for wallet connection. Components should use this
 * instead of touching useAuthStore directly.
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { watchStellarWalletChanges } from "@/lib/stellar-wallet";

export function useWallet() {
  const {
    address,
    network,
    walletName,
    supportedWallets,
    jwt,
    status,
    error,
    hasStellarWallet,
    checkStellarWallets,
    connect,
    disconnect,
    setJwt,
    setAddress,
    setNetwork,
  } = useAuthStore();

  // On mount: detect Stellar wallets and restore session
  useEffect(() => {
    checkStellarWallets();
  }, [checkStellarWallets]);

  // Watch for Stellar wallet account/network changes when supported
  useEffect(() => {
    if (status !== "connected") return;

    const stop = watchStellarWalletChanges(
      (newAddress) => setAddress(newAddress),
      (newNetwork) => setNetwork(newNetwork)
    );

    return stop;
  }, [status, setAddress, setNetwork]);

  const isConnected = status === "connected" && !!address;
  const isConnecting = status === "connecting" || status === "checking";

  // Shorten address for display: GABCD...WXYZ
  const shortAddress = address
    ? `${address.slice(0, 5)}...${address.slice(-4)}`
    : null;

  return {
    address,
    shortAddress,
    network,
    walletName,
    supportedWallets,
    jwt,
    status,
    error,
    isConnected,
    isConnecting,
    hasStellarWallet,
    connect,
    disconnect,
    setJwt,
  };
}
