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
