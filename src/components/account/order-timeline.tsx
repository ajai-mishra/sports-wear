import { CheckCircle2 } from "lucide-react";

import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { cn } from "@/lib/utils";
import type { OrderStatusEvent } from "@/types/order.types";

export function OrderTimeline({ events }: { events: OrderStatusEvent[] }) {
  return (
    <ol className="space-y-6">
      {events.map((event, index) => {
        const isMostRecent = index === events.length - 1;
        return (
          <li key={`${event.status}-${event.occurredAt}`} className="relative flex gap-3 pl-1">
            {!isMostRecent && (
              <span className="absolute top-5 left-[9px] h-full w-px bg-border" aria-hidden="true" />
            )}
            <CheckCircle2
              className={cn("mt-0.5 size-[18px] shrink-0", isMostRecent ? "text-primary" : "text-success")}
              aria-hidden="true"
            />
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={event.status} />
                <time className="text-xs text-muted-foreground" dateTime={event.occurredAt}>
                  {new Date(event.occurredAt).toLocaleString()}
                </time>
              </div>
              {event.note && <p className="mt-1 text-sm text-muted-foreground">{event.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
