"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/api";

interface TransactionDetailProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TYPE_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  income: "default",
  expense: "destructive",
  transfer: "secondary",
  swap: "outline",
  other: "outline",
};

export function TransactionDetail({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(transaction.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) =>
    addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : "N/A";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            {new Date(transaction.date).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hash */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-on-surface-variant">Hash</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono text-on-surface bg-muted rounded px-2 py-1.5 overflow-x-auto">
                {transaction.hash}
              </code>
              <Button variant="ghost" size="icon-xs" onClick={copyHash}>
                {copied ? (
                  <Check className="size-3 text-green-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Type & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-on-surface-variant">Type</p>
              <Badge variant={TYPE_BADGE_VARIANT[transaction.type] ?? "outline"}>
                {transaction.type}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-on-surface-variant">Amount</p>
              <p className="text-sm font-semibold text-on-surface">
                {transaction.amount} {transaction.asset}
              </p>
            </div>
          </div>

          {/* Sender / Receiver */}
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-on-surface-variant">Sender</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-on-surface bg-muted rounded px-2 py-1">
                  {truncateAddress(transaction.sender)}
                </code>
                <a
                  href={`https://stellar.expert/explorer/public/account/${transaction.sender}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-on-surface-variant">Receiver</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-on-surface bg-muted rounded px-2 py-1">
                  {truncateAddress(transaction.receiver)}
                </code>
                <a
                  href={`https://stellar.expert/explorer/public/account/${transaction.receiver}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Memo */}
          {transaction.memo && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-on-surface-variant">Memo</p>
              <p className="text-sm text-on-surface bg-muted rounded px-2 py-1.5">
                {transaction.memo}
              </p>
            </div>
          )}

          {/* Classifications */}
          {transaction.classifications && transaction.classifications.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-on-surface-variant">Classifications</p>
              <div className="flex flex-wrap gap-1.5">
                {transaction.classifications.map((cls) => (
                  <Badge key={cls} variant="outline">
                    {cls}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Raw Payload */}
          {transaction.rawPayload && (
            <div className="space-y-1">
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="flex items-center gap-1 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Raw Payload
                {showRaw ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
              {showRaw && (
                <pre className="text-xs font-mono text-on-surface bg-muted rounded px-2 py-1.5 overflow-x-auto max-h-40 overflow-y-auto">
                  {JSON.stringify(transaction.rawPayload, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
