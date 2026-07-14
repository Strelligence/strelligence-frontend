"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Webhook,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";
import {
  fetchWebhooks,
  createWebhook,
  deleteWebhook,
  toggleWebhook,
} from "@/lib/api";
import type { Webhook as WebhookType, WebhookDelivery } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WebhookDialog } from "@/components/dashboard/webhook-dialog";

function truncateUrl(url: string) {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 20 ? u.pathname.slice(0, 20) + "..." : u.pathname;
    return `${u.hostname}${path}`;
  } catch {
    return url.length > 40 ? url.slice(0, 40) + "..." : url;
  }
}

export default function WebhooksPage() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WebhookType | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["webhooks", address],
    queryFn: () => fetchWebhooks(address!),
    enabled: !!address,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { url: string; events: string[] }) =>
      createWebhook(address!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", address] });
      setDialogOpen(false);
      toast.success("Webhook created");
    },
    onError: () => toast.error("Failed to create webhook"),
  });

  const deleteMutation = useMutation({
    mutationFn: (webhookId: string) => deleteWebhook(address!, webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", address] });
      setDeleteTarget(null);
      toast.success("Webhook deleted");
    },
    onError: () => toast.error("Failed to delete webhook"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "disabled" }) =>
      toggleWebhook(address!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", address] });
      toast.success("Webhook updated");
    },
    onError: () => toast.error("Failed to update webhook"),
  });

  const copySecret = (webhook: WebhookType) => {
    if (webhook.secret) {
      navigator.clipboard.writeText(webhook.secret);
      setCopiedId(webhook.id);
      setShowSecret(webhook.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const webhooks: WebhookType[] = data?.webhooks ?? [];
  const deliveries: WebhookDelivery[] = data?.recentDeliveries ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-headline-md text-base font-medium text-on-surface">
          Webhooks
        </h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus className="size-3.5" />
          Add Webhook
        </Button>
      </div>

      {/* Webhooks */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
            <Webhook className="size-6 text-on-surface-variant" />
          </div>
          <p className="text-sm font-medium text-on-surface">No webhooks</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Add a webhook to receive notifications for events
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {webhooks.map((wh) => (
            <Card key={wh.id}>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-on-surface truncate">
                        {truncateUrl(wh.url)}
                      </code>
                      <a
                        href={wh.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline shrink-0"
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant={wh.status === "active" ? "default" : "outline"}
                      size="xs"
                      onClick={() =>
                        toggleMutation.mutate({
                          id: wh.id,
                          status: wh.status === "active" ? "disabled" : "active",
                        })
                      }
                    >
                      {wh.status === "active" ? "Active" : "Disabled"}
                    </Button>
                  </div>
                </div>

                {/* Secret */}
                {wh.secret && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant">Secret:</span>
                    <code className="text-xs font-mono text-on-surface-variant bg-muted rounded px-1.5 py-0.5">
                      {showSecret === wh.id ? wh.secret : "••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setShowSecret(showSecret === wh.id ? null : wh.id)
                      }
                    >
                      {showSecret === wh.id ? (
                        <EyeOff className="size-3" />
                      ) : (
                        <Eye className="size-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => copySecret(wh)}
                    >
                      {copiedId === wh.id ? (
                        <Check className="size-3 text-green-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Created: {new Date(wh.createdAt).toLocaleDateString()}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setDeleteTarget(wh)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delivery Logs */}
      {deliveries.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-headline-md text-sm font-medium text-on-surface">
            Recent Deliveries
          </h3>
          <div className="rounded-xl border border-outline-variant overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      {d.status === "success" ? (
                        <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                          <CheckCircle className="size-3" />
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                          <XCircle className="size-3" />
                          Failed
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-on-surface-variant">
                      {d.responseCode}
                    </TableCell>
                    <TableCell className="text-xs text-on-surface-variant">
                      {new Date(d.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <WebhookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(url, events) => createMutation.mutate({ url, events })}
        submitting={createMutation.isPending}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Webhook</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this webhook? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
