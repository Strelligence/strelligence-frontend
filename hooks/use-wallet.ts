/**
 * The primary hook for wallet connection. Components should use this
 * instead of touching useAuthStore directly.
 */

"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { watchFreighterChanges } from "@/lib/freighter";

export function useWallet() {
  const {
    address,
    network,
    jwt,
    status,
    error,
    isFreighterInstalled,
    checkFreighter,
    connect,
    disconnect,
    setJwt,
    setAddress,
    setNetwork,
  } = useAuthStore();

  // On mount: detect Freighter and restore session
  useEffect(() => {
    checkFreighter();
  }, [checkFreighter]);

  // Watch for Freighter account/network changes
  useEffect(() => {
    if (status !== "connected") return;

    const stop = watchFreighterChanges(
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
    jwt,
    status,
    error,
    isConnected,
    isConnecting,
    isFreighterInstalled,
    connect,
    disconnect,
    setJwt,
  };
}