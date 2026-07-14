import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = sessionStorage.getItem("strelligence-auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const jwt = parsed?.state?.jwt;
        if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
      } catch {}
    }
  }
  return config;
});

export interface WalletSummary {
  totalBalance: string;
  netChange24h: string;
  netChange7d: string;
  netChange30d: string;
  topAssets: { code: string; balance: string; change: string }[];
}

export interface Transaction {
  hash: string;
  type: "income" | "expense" | "transfer" | "swap" | "other";
  amount: string;
  asset: string;
  date: string;
  counterparty: string;
  memo?: string;
  classifications?: string[];
  sender: string;
  receiver: string;
  rawPayload?: Record<string, unknown>;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  cursor: string | null;
  total: number;
}

export interface Insight {
  id: string;
  type: "spending_trend" | "income_stability" | "top_counterparties" | "asset_distribution" | "risk_score";
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CashflowData {
  date: string;
  income: number;
  expense: number;
}

export async function fetchWalletSummary(address: string): Promise<WalletSummary> {
  const { data } = await api.get(`/wallet/${address}/summary`);
  return data;
}

export async function fetchRecentTransactions(address: string): Promise<Transaction[]> {
  const { data } = await api.get(`/wallet/${address}/transactions`, {
    params: { limit: 5 },
  });
  return data.transactions ?? data;
}

export async function fetchTransactions(
  address: string,
  params: {
    type?: string;
    asset?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    cursor?: string;
    limit?: number;
  } = {}
): Promise<TransactionListResponse> {
  const { data } = await api.get(`/wallet/${address}/transactions`, { params });
  return data;
}

export async function fetchCashflow(address: string): Promise<CashflowData[]> {
  const { data } = await api.get(`/wallet/${address}/cashflow`, {
    params: { days: 7 },
  });
  return data;
}

export async function fetchInsights(address: string): Promise<Insight[]> {
  const { data } = await api.get(`/wallet/${address}/insights`);
  return data.insights ?? data;
}

export async function fetchActiveSubscriptions(address: string): Promise<number> {
  const { data } = await api.get(`/wallet/${address}/subscriptions/count`);
  return data.count ?? 0;
}

// ─── Recurring Payments ──────────────────────────────────────────────────────

export interface RecurringPattern {
  id: string;
  merchant: string | null;
  amount: string;
  asset: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  status: "active" | "paused" | "cancelled";
  lastDetected: string;
  confidence: number;
  source: "auto-detected" | "manually-added";
}

export interface RecurringPatternsResponse {
  patterns: RecurringPattern[];
  totalActive: number;
  totalMonthlyCost: string;
}

export async function fetchRecurringPatterns(
  address: string,
  params: { status?: string } = {}
): Promise<RecurringPatternsResponse> {
  const { data } = await api.get(`/wallet/${address}/recurring`, { params });
  return data;
}

export async function updateRecurringPattern(
  address: string,
  patternId: string,
  status: "active" | "paused" | "cancelled"
): Promise<void> {
  await api.patch(`/wallet/${address}/recurring/${patternId}`, { status });
}

// ─── Extended Cashflow ───────────────────────────────────────────────────────

export interface CashflowPeriodData {
  income: number;
  expense: number;
  net: number;
}

export interface CashflowDailyData {
  date: string;
  income: number;
  expense: number;
}

export interface CashflowCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface CashflowSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashflow: number;
  savingsRate: number;
}

export interface CashflowPeriodResponse {
  summary: CashflowSummary;
  daily: CashflowDailyData[];
  categories: CashflowCategory[];
  comparison: { currentPeriod: CashflowPeriodData; previousPeriod: CashflowPeriodData };
}

export async function fetchCashflowPeriod(
  address: string,
  period: "7d" | "30d" | "90d" | "1y"
): Promise<CashflowPeriodResponse> {
  const { data } = await api.get(`/wallet/${address}/cashflow/period`, {
    params: { period },
  });
  return data;
}

// ─── API Keys ────────────────────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  status: "active" | "revoked";
  createdAt: string;
  lastUsedAt: string | null;
}

export interface ApiKeyGeneratedResponse {
  id: string;
  name: string;
  fullKey: string;
  keyPrefix: string;
  createdAt: string;
}

export interface ApiKeysResponse {
  keys: ApiKey[];
  totalRequests: number;
}

export async function fetchApiKeys(address: string): Promise<ApiKeysResponse> {
  const { data } = await api.get(`/wallet/${address}/api-keys`);
  return data;
}

export async function generateApiKey(
  address: string,
  name: string
): Promise<ApiKeyGeneratedResponse> {
  const { data } = await api.post(`/wallet/${address}/api-keys`, { name });
  return data;
}

export async function revokeApiKey(
  address: string,
  keyId: string
): Promise<void> {
  await api.delete(`/wallet/${address}/api-keys/${keyId}`);
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export const WEBHOOK_EVENTS = [
  { value: "transaction.created", label: "Transaction Created" },
  { value: "transaction.classified", label: "Transaction Classified" },
  { value: "recurring.detected", label: "Recurring Detected" },
  { value: "recurring.payment_confirmed", label: "Payment Confirmed" },
  { value: "insight.generated", label: "Insight Generated" },
] as const;

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: "active" | "disabled";
  secret: string | null;
  createdAt: string;
}

export interface WebhookDelivery {
  id: string;
  status: "success" | "failed";
  responseCode: number;
  timestamp: string;
}

export interface WebhooksResponse {
  webhooks: Webhook[];
  recentDeliveries: WebhookDelivery[];
}

export async function fetchWebhooks(address: string): Promise<WebhooksResponse> {
  const { data } = await api.get(`/wallet/${address}/webhooks`);
  return data;
}

export async function createWebhook(
  address: string,
  payload: { url: string; events: string[] }
): Promise<Webhook> {
  const { data } = await api.post(`/wallet/${address}/webhooks`, payload);
  return data;
}

export async function deleteWebhook(
  address: string,
  webhookId: string
): Promise<void> {
  await api.delete(`/wallet/${address}/webhooks/${webhookId}`);
}

export async function toggleWebhook(
  address: string,
  webhookId: string,
  status: "active" | "disabled"
): Promise<void> {
  await api.patch(`/wallet/${address}/webhooks/${webhookId}`, { status });
}
