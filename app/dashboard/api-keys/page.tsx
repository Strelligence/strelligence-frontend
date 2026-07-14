"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";
import {
  fetchApiKeys,
  generateApiKey,
  revokeApiKey,
} from "@/lib/api";
import type { ApiKey, ApiKeyGeneratedResponse } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ApiKeyDialog } from "@/components/dashboard/api-key-dialog";

export default function ApiKeysPage() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<ApiKeyGeneratedResponse | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["apiKeys", address],
    queryFn: () => fetchApiKeys(address!),
    enabled: !!address,
  });

  const generateMutation = useMutation({
    mutationFn: (name: string) => generateApiKey(address!, name),
    onSuccess: (result) => {
      setGeneratedKey(result);
      queryClient.invalidateQueries({ queryKey: ["apiKeys", address] });
      toast.success("API key generated");
    },
    onError: () => toast.error("Failed to generate key"),
  });

  const revokeMutation = useMutation({
    mutationFn: (keyId: string) => revokeApiKey(address!, keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys", address] });
      setRevokeTarget(null);
      toast.success("API key revoked");
    },
    onError: () => toast.error("Failed to revoke key"),
  });

  const copyMaskedKey = (key: ApiKey) => {
    const masked = `${key.keyPrefix}...`;
    navigator.clipboard.writeText(masked);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const keys: ApiKey[] = data?.keys ?? [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-on-surface-variant">Total Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-on-surface">{keys.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-on-surface-variant">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {keys.filter((k) => k.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-on-surface-variant">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-on-surface">
              {data?.totalRequests?.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-headline-md text-base font-medium text-on-surface">
          API Keys
        </h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <KeyRound className="size-3.5" />
          Generate New Key
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
            <KeyRound className="size-6 text-on-surface-variant" />
          </div>
          <p className="text-sm font-medium text-on-surface">No API keys</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Generate a key to access the API programmatically
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-outline-variant overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium text-on-surface">
                    {key.name}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono text-on-surface-variant">
                      {key.keyPrefix}...xxxx
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={key.status === "active" ? "default" : "destructive"}
                    >
                      {key.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-on-surface-variant">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-on-surface-variant">
                    {key.lastUsedAt
                      ? new Date(key.lastUsedAt).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => copyMaskedKey(key)}
                      >
                        {copiedId === key.id ? (
                          <Check className="size-3 text-green-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                      {key.status === "active" && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setRevokeTarget(key)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Generate Dialog */}
      <ApiKeyDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setGeneratedKey(null);
        }}
        generatedKey={generatedKey}
        onGenerate={(name) => generateMutation.mutate(name)}
        generating={generateMutation.isPending}
      />

      {/* Revoke Confirmation */}
      <Dialog open={!!revokeTarget} onOpenChange={() => setRevokeTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke &ldquo;{revokeTarget?.name}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => revokeTarget && revokeMutation.mutate(revokeTarget.id)}
              disabled={revokeMutation.isPending}
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
