"use client";

import { useState } from "react";
import { Copy, Check, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedKey: { name: string; fullKey: string } | null;
  onGenerate: (name: string) => void;
  generating: boolean;
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  generatedKey,
  onGenerate,
  generating,
}: ApiKeyDialogProps) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!name.trim()) return;
    onGenerate(name.trim());
  };

  const handleCopy = () => {
    if (generatedKey?.fullKey) {
      navigator.clipboard.writeText(generatedKey.fullKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName("");
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {generatedKey ? (
          <>
            <DialogHeader>
              <DialogTitle>API Key Generated</DialogTitle>
              <DialogDescription>
                Copy this key now. It will not be shown again.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                <div className="flex items-center gap-2 text-amber-500 text-xs font-medium">
                  <AlertTriangle className="size-3.5" />
                  This key will not be shown again
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-on-surface-variant">Key for: {generatedKey.name}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-on-surface bg-muted rounded px-2 py-2 break-all">
                    {generatedKey.fullKey}
                  </code>
                  <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
                    {copied ? (
                      <Check className="size-3 text-green-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
              <DialogDescription>
                Create a new key for programmatic access.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant">
                  Key Name
                </label>
                <Input
                  placeholder="e.g. production-server"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!name.trim() || generating}
              >
                {generating ? "Generating..." : "Generate"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
