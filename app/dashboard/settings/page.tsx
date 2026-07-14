"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@/hooks/use-wallet";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { settingsSchema, type SettingsFormValues } from "@/lib/validations/settings";

export default function SettingsPage() {
  const { address, walletName } = useWallet();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      email: "",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      emailNotifications: true,
      alertPrefs: {
        largeTransactions: true,
        newSubscriptions: true,
        priceAlerts: false,
        weeklyReport: true,
      },
    },
    mode: "onBlur",
  });

  const emailNotifications = watch("emailNotifications");
  const alertPrefs = watch("alertPrefs");
  const currency = watch("currency");
  const dateFormat = watch("dateFormat");

  const onSubmit = (data: SettingsFormValues) => {
    toast.success("Settings saved");
  };

  const toggleAlert = (key: keyof typeof alertPrefs) => {
    setValue(`alertPrefs.${key}`, !alertPrefs[key], { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList variant="line">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Wallet Address
                  </label>
                  <Input
                    value={address ?? "Not connected"}
                    readOnly
                    className="font-mono text-sm bg-muted"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Connected Wallet
                  </label>
                  <Input
                    value={walletName ?? "Unknown"}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Account Created
                  </label>
                  <Input
                    value={new Date().toLocaleDateString()}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <Button type="submit" disabled={!isDirty}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      Email Notifications
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Receive email updates about your account
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("emailNotifications", !emailNotifications, { shouldDirty: true })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailNotifications ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                        emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t border-outline-variant pt-4">
                  <p className="text-sm font-medium text-on-surface mb-3">
                    Alert Preferences
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: "largeTransactions" as const, label: "Large transactions", desc: "Alert on transactions over $100" },
                      { key: "newSubscriptions" as const, label: "New subscriptions", desc: "When a recurring payment is detected" },
                      { key: "priceAlerts" as const, label: "Price alerts", desc: "Significant price movements" },
                      { key: "weeklyReport" as const, label: "Weekly report", desc: "Summary of your weekly activity" },
                    ].map(({ key, label, desc }) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={alertPrefs[key]}
                          onChange={() => toggleAlert(key)}
                          className="size-4 rounded border-input accent-primary"
                        />
                        <div>
                          <p className="text-sm text-on-surface">{label}</p>
                          <p className="text-xs text-on-surface-variant">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-4">
                  <p className="text-sm font-medium text-on-surface mb-1">
                    Webhook Notifications
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Configure webhooks in the{" "}
                    <a href="/dashboard/webhooks" className="text-primary hover:underline">
                      Webhooks
                    </a>{" "}
                    page to receive real-time event notifications.
                  </p>
                </div>

                <Button type="submit" disabled={!isDirty}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Theme
                  </label>
                  <div className="flex gap-2">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <Button
                        key={t}
                        type="button"
                        variant={theme === t ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme(t)}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Currency Display
                  </label>
                  <div className="flex gap-2">
                    {["USD", "XLM"].map((c) => (
                      <Button
                        key={c}
                        type="button"
                        variant={currency === c ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("currency", c as "USD" | "XLM", { shouldDirty: true })}
                      >
                        {c}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Date Format */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Date Format
                  </label>
                  <div className="flex gap-2">
                    {(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] as const).map((f) => (
                      <Button
                        key={f}
                        type="button"
                        variant={dateFormat === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("dateFormat", f, { shouldDirty: true })}
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button type="submit" disabled={!isDirty}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
