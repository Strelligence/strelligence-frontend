/**
 * Central Stellar wallet integration.
 *
 * Browser apps cannot scan a user's device for wallets. They can only detect
 * wallet providers that expose themselves to the page, so this helper uses the
 * Stellar Wallets Kit to cover supported browser wallet providers.
 */

import {
  KitEventType,
  Networks,
  StellarWalletsKit,
  type IKitError,
  type ModuleInterface,
} from "@creit.tech/stellar-wallets-kit";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import type {
  StellarConnectionResult,
  StellarNetwork,
  StellarSupportedWallet,
  StellarWalletError,
} from "@/types/wallet";

export const STELLAR_WALLET_INSTALL_URL = "https://stellar.org/ecosystem/wallets";

let kitInitialized = false;
let freighterDetected = false;
const WALLET_IDS_IGNORED_FOR_EXTENSION_DETECTION = new Set(["albedo"]);
const FREIGHTER_MESSAGE_SOURCE = "FREIGHTER_EXTERNAL_MSG_REQUEST";
const FREIGHTER_RESPONSE_SOURCE = "FREIGHTER_EXTERNAL_MSG_RESPONSE";
const FREIGHTER_CONNECTION_STATUS = "REQUEST_CONNECTION_STATUS";

type WindowWithWalletProviders = Window &
  typeof globalThis & {
    freighter?: boolean;
    freighterApi?: unknown;
    stellar?: {
      provider?: string;
      platform?: string;
    };
    rabet?: unknown;
    hanaWallet?: {
      stellar?: unknown;
    };
    kleverWallet?: {
      stellar?: unknown;
    };
    $onekey?: {
      stellar?: unknown;
    };
    bitkeep?: {
      stellar?: unknown;
    };
    cactuslink_stellar?: unknown;
    FordefiProviders?: {
      StellarProvider?: unknown;
    };
  };

type FreighterConnectionResponse = {
  source?: string;
  messagedId?: number;
  isConnected?: boolean;
};

class DetectedFreighterModule extends FreighterModule {
  async isAvailable() {
    if (freighterDetected || hasImmediateFreighterProvider()) return true;
    return super.isAvailable();
  }
}

function ensureWalletKit() {
  if (typeof window === "undefined") {
    throw "UNKNOWN" as StellarWalletError;
  }

  if (kitInitialized) return;

  StellarWalletsKit.init({
    modules: getWalletModules(),
    network: Networks.PUBLIC,
    authModal: {
      showInstallLabel: true,
      hideUnsupportedWallets: false,
    },
  });

  kitInitialized = true;
}

function getWalletModules(): ModuleInterface[] {
  return defaultModules().map((module) =>
    module.productId === "freighter" ? new DetectedFreighterModule() : module
  );
}

function isDetectedBrowserWallet(wallet: StellarSupportedWallet) {
  return (
    !WALLET_IDS_IGNORED_FOR_EXTENSION_DETECTION.has(wallet.id) &&
    (wallet.isAvailable || wallet.isPlatformWrapper)
  );
}

function getWalletWindow(): WindowWithWalletProviders | null {
  if (typeof window === "undefined") return null;
  return window as WindowWithWalletProviders;
}

function hasImmediateFreighterProvider() {
  const walletWindow = getWalletWindow();
  if (!walletWindow) return false;

  return (
    walletWindow.freighter === true ||
    Boolean(walletWindow.freighterApi) ||
    walletWindow.stellar?.provider === "freighter"
  );
}

function hasImmediateExtensionProvider() {
  const walletWindow = getWalletWindow();
  if (!walletWindow) return false;

  return (
    hasImmediateFreighterProvider() ||
    Boolean(walletWindow.rabet) ||
    Boolean(walletWindow.hanaWallet?.stellar) ||
    Boolean(walletWindow.kleverWallet?.stellar) ||
    Boolean(walletWindow.$onekey?.stellar) ||
    Boolean(walletWindow.bitkeep?.stellar) ||
    Boolean(walletWindow.cactuslink_stellar) ||
    Boolean(walletWindow.FordefiProviders?.StellarProvider)
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestFreighterConnectionStatus(timeoutMs: number): Promise<boolean> {
  const walletWindow = getWalletWindow();
  if (!walletWindow) return Promise.resolve(false);
  if (hasImmediateFreighterProvider()) return Promise.resolve(true);

  return new Promise((resolve) => {
    const messageId = Date.now() + Math.random();

    const cleanup = () => {
      walletWindow.removeEventListener("message", onMessage);
      clearTimeout(timeout);
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeoutMs);

    const onMessage = (event: MessageEvent<FreighterConnectionResponse>) => {
      if (event.source !== walletWindow) return;
      if (event.data?.source !== FREIGHTER_RESPONSE_SOURCE) return;
      if (event.data.messagedId !== messageId) return;

      cleanup();
      resolve(event.data.isConnected === true);
    };

    walletWindow.addEventListener("message", onMessage);
    walletWindow.postMessage(
      {
        source: FREIGHTER_MESSAGE_SOURCE,
        messageId,
        type: FREIGHTER_CONNECTION_STATUS,
      },
      walletWindow.location.origin
    );
  });
}

async function detectFreighterExtension() {
  if (freighterDetected || hasImmediateFreighterProvider()) {
    freighterDetected = true;
    return true;
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (await requestFreighterConnectionStatus(2400)) {
      freighterDetected = true;
      return true;
    }

    await wait(150);
  }

  return false;
}

function withDetectedWallets(
  wallets: StellarSupportedWallet[],
  detectedFreighter: boolean
) {
  return wallets.map((wallet) => {
    if (wallet.id === "freighter" && detectedFreighter) {
      return { ...wallet, isAvailable: true };
    }

    return wallet;
  });
}

function inferNetworkUrl(networkPassphrase: string) {
  if (networkPassphrase === Networks.PUBLIC) return "https://horizon.stellar.org";
  if (networkPassphrase === Networks.TESTNET) return "https://horizon-testnet.stellar.org";
  return undefined;
}

function toWalletError(error: unknown): StellarWalletError {
  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as IKitError).message)
      : String(error ?? "");

  if (/closed|reject|denied|cancel/i.test(message)) return "USER_REJECTED";
  if (/not installed|not connected|not available/i.test(message)) return "NOT_INSTALLED";
  if (/allow|access|permission/i.test(message)) return "NOT_ALLOWED";
  return "UNKNOWN";
}

export async function getSupportedStellarWallets(): Promise<StellarSupportedWallet[]> {
  try {
    ensureWalletKit();
    const [wallets, detectedFreighter] = await Promise.all([
      StellarWalletsKit.refreshSupportedWallets(),
      detectFreighterExtension(),
    ]);

    return withDetectedWallets(wallets, detectedFreighter);
  } catch {
    return [];
  }
}

export async function hasInstalledStellarWallet(): Promise<boolean> {
  const [wallets, detectedFreighter] = await Promise.all([
    getSupportedStellarWallets(),
    detectFreighterExtension(),
  ]);

  return (
    detectedFreighter ||
    wallets.some(isDetectedBrowserWallet) ||
    hasImmediateExtensionProvider()
  );
}

export async function getConnectedAddress(): Promise<string | null> {
  try {
    ensureWalletKit();
    const result = await StellarWalletsKit.getAddress();
    return result.address ?? null;
  } catch {
    return null;
  }
}

export async function getConnectedNetwork(): Promise<StellarNetwork | null> {
  try {
    ensureWalletKit();
    const result = await StellarWalletsKit.getNetwork();
    return {
      network: result.network,
      networkPassphrase: result.networkPassphrase,
      networkUrl: inferNetworkUrl(result.networkPassphrase),
    };
  } catch {
    return null;
  }
}

export async function connectStellarWallet(): Promise<StellarConnectionResult> {
  ensureWalletKit();

  const wallets = await getSupportedStellarWallets();
  const hasWallet = wallets.some(isDetectedBrowserWallet);

  if (!hasWallet) {
    throw "NOT_INSTALLED" as StellarWalletError;
  }

  try {
    const { address } = await StellarWalletsKit.authModal();
    const network = await getConnectedNetwork();
    const selectedWallet = wallets.find(
      (wallet) => wallet.id === StellarWalletsKit.selectedModule.productId
    );

    return {
      address,
      network,
      walletId: selectedWallet?.id,
      walletName: selectedWallet?.name ?? StellarWalletsKit.selectedModule.productName,
    };
  } catch (error) {
    throw toWalletError(error);
  }
}

export async function disconnectStellarWallet(): Promise<void> {
  try {
    ensureWalletKit();
    await StellarWalletsKit.disconnect();
  } catch {
    // The local app state is still cleared by the auth store.
  }
}

export async function signTx(
  xdr: string,
  networkPassphrase: string,
  address: string
): Promise<string> {
  ensureWalletKit();
  const result = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase,
    address,
  });
  return result.signedTxXdr;
}

export async function signAuth(
  authEntry: string,
  networkPassphrase: string,
  address: string
): Promise<string> {
  ensureWalletKit();
  const result = await StellarWalletsKit.signAuthEntry(authEntry, {
    networkPassphrase,
    address,
  });
  return result.signedAuthEntry;
}

export function encodeChallenge(challenge: string): string {
  return btoa(challenge);
}

export function watchStellarWalletChanges(
  onAddressChange: (address: string) => void,
  onNetworkChange: (network: string) => void
): () => void {
  try {
    ensureWalletKit();
    return StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
      if (event.payload.address) onAddressChange(event.payload.address);
      if (event.payload.networkPassphrase) {
        onNetworkChange(event.payload.networkPassphrase);
      }
    });
  } catch {
    return () => undefined;
  }
}
