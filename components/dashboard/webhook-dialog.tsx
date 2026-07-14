"use client";

import { useState } from "react";
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
import { WEBHOOK_EVENTS } from "@/lib/api";

interface WebhookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string, events: string[]) => void;
  submitting: boolean;
}

export function WebhookDialog({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: WebhookDialogProps) {
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggleEvent = (event: string) => {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      setError("URL is required");
      return;
    }
    try {
      new URL(url);
    } catch {
      setError("Invalid URL format");
      return;
    }
    if (events.length === 0) {
      setError("Select at least one event");
      return;
    }
    setError("");
    onSubmit(url.trim(), events);
  };

  const handleClose = () => {
    setUrl("");
    setEvents([]);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Webhook</DialogTitle>
          <DialogDescription>
            Register a URL to receive webhook notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant">
              Webhook URL
            </label>
            <Input
              placeholder="https://your-server.com/webhook"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-on-surface-variant">
              Events
            </label>
            <div className="space-y-2">
              {WEBHOOK_EVENTS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={events.includes(value)}
                    onChange={() => toggleEvent(value)}
                    className="size-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm text-on-surface">{label}</span>
                  <code className="text-xs text-on-surface-variant font-mono">
                    {value}
                  </code>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Webhook"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
