import Link from "next/link";
import { WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <WifiOff className="size-12 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-sm text-muted-foreground">
        This page isn&apos;t available without an internet connection. Reconnect and try again.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        Back to home
      </Button>
    </div>
  );
}
