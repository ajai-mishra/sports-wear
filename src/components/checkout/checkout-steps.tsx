import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type CheckoutStepId = "address" | "delivery" | "payment";

const STEPS: { id: CheckoutStepId; label: string }[] = [
  { id: "address", label: "Address" },
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
];

export function CheckoutSteps({ currentStep }: { currentStep: CheckoutStepId }) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4" aria-label="Checkout progress">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isComplete && !isCurrent && "border-input text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span className="h-px w-6 shrink-0 bg-border sm:w-10" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
