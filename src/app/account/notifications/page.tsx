"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * No backend endpoint exists yet for notification preferences, so this is
 * local component state only — "Save preferences" mocks persistence with a
 * success toast until a real /api/account/notifications route exists.
 */
interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  priceDropAlerts: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  orderUpdates: true,
  promotions: false,
  priceDropAlerts: true,
};

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  function togglePreference(key: keyof NotificationPreferences) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  }

  function handleSave() {
    toast.success("Preferences saved.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      <Card className="max-w-lg">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="order-updates">Order updates</Label>
              <p className="text-sm text-muted-foreground">Shipping and delivery status changes.</p>
            </div>
            <Switch
              id="order-updates"
              checked={preferences.orderUpdates}
              onCheckedChange={() => togglePreference("orderUpdates")}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="promotions">Promotions</Label>
              <p className="text-sm text-muted-foreground">Sales, discounts, and seasonal offers.</p>
            </div>
            <Switch
              id="promotions"
              checked={preferences.promotions}
              onCheckedChange={() => togglePreference("promotions")}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="price-drop-alerts">Price-drop alerts</Label>
              <p className="text-sm text-muted-foreground">When a wishlisted item drops in price.</p>
            </div>
            <Switch
              id="price-drop-alerts"
              checked={preferences.priceDropAlerts}
              onCheckedChange={() => togglePreference("priceDropAlerts")}
            />
          </div>

          <Button onClick={handleSave}>Save preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
