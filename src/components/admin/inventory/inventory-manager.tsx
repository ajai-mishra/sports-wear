"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  type AdminInventoryRow,
  useAdjustInventoryMutation,
  useAdminInventoryQuery,
} from "@/hooks/use-admin-inventory";
import { ApiRequestError } from "@/lib/api-client";
import { adjustInventorySchema, type AdjustInventoryInput } from "@/lib/validation/admin-inventory.schema";
import { cn } from "@/lib/utils";

function isLowStock(row: AdminInventoryRow): boolean {
  return row.stockQuantity <= row.reorderThreshold;
}

interface AdjustStockDialogProps {
  row: AdminInventoryRow | null;
  onOpenChange: (open: boolean) => void;
}

function AdjustStockDialog({ row, onOpenChange }: AdjustStockDialogProps) {
  const adjustMutation = useAdjustInventoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<AdjustInventoryInput>({
    resolver: zodResolver(adjustInventorySchema),
    defaultValues: { stockQuantity: 0, reason: "" },
  });

  useEffect(() => {
    if (row) {
      reset({ stockQuantity: row.stockQuantity, reason: "" });
    }
  }, [row, reset]);

  async function onSubmit(data: AdjustInventoryInput) {
    if (!row) return;
    try {
      await adjustMutation.mutateAsync({ variantId: row.variantId, input: data });
      toast.success(`Stock updated for ${row.sku}.`);
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      setError("root", { message });
    }
  }

  return (
    <Dialog open={row !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            {row ? `${row.productName} — ${row.size} / ${row.color} (${row.sku})` : null}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          {errors.root && (
            <p className="text-sm text-destructive" role="alert">
              {errors.root.message}
            </p>
          )}

          <FormField label="New stock quantity" htmlFor="stock-quantity" error={errors.stockQuantity?.message}>
            <Input
              id="stock-quantity"
              type="number"
              min={0}
              step={1}
              aria-invalid={!!errors.stockQuantity}
              {...register("stockQuantity", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Reason" htmlFor="stock-reason" error={errors.reason?.message}>
            <Textarea
              id="stock-reason"
              rows={3}
              placeholder="e.g. Received new shipment, correcting a count error..."
              aria-invalid={!!errors.reason}
              {...register("reason")}
            />
          </FormField>

          <DialogFooter>
            <Button type="submit" disabled={adjustMutation.isPending}>
              {adjustMutation.isPending ? <Loader2 className="animate-spin" /> : null}
              Save adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function InventoryManager() {
  const { data: rows, isLoading, isError } = useAdminInventoryQuery();
  const [adjustingRow, setAdjustingRow] = useState<AdminInventoryRow | null>(null);

  const lowStockCount = rows?.filter(isLowStock).length ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Track stock levels across every product variant and adjust counts as they change.
        </p>
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            {lowStockCount} variant{lowStockCount === 1 ? "" : "s"} at or below reorder threshold.
          </span>
        </div>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading inventory...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load inventory.</p>}

      {rows && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder at</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No inventory found.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((row) => {
                const lowStock = isLowStock(row);
                return (
                  <TableRow
                    key={row.variantId}
                    className={cn(lowStock && "bg-amber-500/10 hover:bg-amber-500/15")}
                  >
                    <TableCell className="font-medium">{row.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{row.sku}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>{row.color}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {row.stockQuantity}
                        {lowStock && <Badge variant="destructive">Low stock</Badge>}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.reorderThreshold}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setAdjustingRow(row)}>
                        Adjust stock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AdjustStockDialog row={adjustingRow} onOpenChange={(open) => !open && setAdjustingRow(null)} />
    </div>
  );
}
