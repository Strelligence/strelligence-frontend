"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { webhookSchema, type WebhookFormValues } from "@/lib/validations/webhook";

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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues: { url: "", events: [] },
    mode: "onBlur",
  });

  const events = watch("events");

  const toggleEvent = (event: string) => {
    const current = events;
    const next = current.includes(event)
      ? current.filter((e) => e !== event)
      : [...current, event];
    setValue("events", next, { shouldValidate: true });
  };

  const onFormSubmit = (data: WebhookFormValues) => {
    onSubmit(data.url.trim(), data.events);
  };

  const handleClose = () => {
    reset();
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

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant">
              Webhook URL
            </label>
            <Input
              placeholder="https://your-server.com/webhook"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
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
            {errors.events && (
              <p className="text-xs text-destructive">{errors.events.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || submitting}>
              {submitting ? "Creating..." : "Create Webhook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
