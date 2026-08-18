"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type AdminBanner,
  useAdminBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useUpdateBannerMutation,
} from "@/hooks/use-admin-banners";
import { ApiRequestError } from "@/lib/api-client";
import type { AdminCreateBannerInput } from "@/lib/validation/admin-banner.schema";

// Mirrors admin-banner.schema.ts's adminCreateBannerSchema exactly, minus the
// `.default(...)` on isActive/sortOrder. A schema with `.default(...)` makes
// that field optional on its *input* type while `z.infer` (used for
// AdminCreateBannerInput) reflects the required *output* type — that split
// is exactly what zodResolver + useForm can't reconcile into one generic.
// Every field here is required on both sides, so it type-checks cleanly.
const bannerFormSchema = z.object({
  title: z.string().trim().min(2, "Enter a title."),
  subtitle: z.string().trim().min(1, "Enter a subtitle."),
  ctaLabel: z.string().trim().min(1, "Enter a CTA label."),
  ctaHref: z.string().trim().min(1, "Enter a CTA link."),
  imageUrl: z.string().trim().min(1, "Enter an image URL."),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0),
});

function toFormValues(banner?: AdminBanner): AdminCreateBannerInput {
  if (!banner) {
    return {
      title: "",
      subtitle: "",
      ctaLabel: "",
      ctaHref: "",
      imageUrl: "",
      isActive: true,
      sortOrder: 0,
    };
  }
  return {
    title: banner.title,
    subtitle: banner.subtitle,
    ctaLabel: banner.ctaLabel,
    ctaHref: banner.ctaHref,
    imageUrl: banner.imageUrl,
    isActive: banner.isActive,
    sortOrder: banner.sortOrder,
  };
}

interface BannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: AdminBanner | null;
}

function BannerFormDialog({ open, onOpenChange, banner }: BannerFormDialogProps) {
  const isEditMode = banner !== null;
  const createMutation = useCreateBannerMutation();
  const updateMutation = useUpdateBannerMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<AdminCreateBannerInput>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: toFormValues(banner ?? undefined),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(banner ?? undefined));
    }
  }, [open, banner, reset]);

  async function onSubmit(data: AdminCreateBannerInput) {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id: banner.id, input: data });
        toast.success("Banner updated.");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Banner created.");
      }
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      setError("root", { message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit banner" : "New banner"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update this banner's content." : "Add a new homepage banner."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          {errors.root && (
            <p className="text-sm text-destructive" role="alert">
              {errors.root.message}
            </p>
          )}

          <FormField label="Title" htmlFor="banner-title" error={errors.title?.message}>
            <Input id="banner-title" aria-invalid={!!errors.title} {...register("title")} />
          </FormField>

          <FormField label="Subtitle" htmlFor="banner-subtitle" error={errors.subtitle?.message}>
            <Input id="banner-subtitle" aria-invalid={!!errors.subtitle} {...register("subtitle")} />
          </FormField>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="CTA label" htmlFor="banner-cta-label" error={errors.ctaLabel?.message}>
              <Input id="banner-cta-label" aria-invalid={!!errors.ctaLabel} {...register("ctaLabel")} />
            </FormField>
            <FormField label="CTA link" htmlFor="banner-cta-href" error={errors.ctaHref?.message}>
              <Input id="banner-cta-href" aria-invalid={!!errors.ctaHref} {...register("ctaHref")} />
            </FormField>
          </div>

          <FormField label="Image URL" htmlFor="banner-image" error={errors.imageUrl?.message}>
            <Input id="banner-image" aria-invalid={!!errors.imageUrl} {...register("imageUrl")} />
          </FormField>

          <FormField label="Sort order" htmlFor="banner-sort-order" error={errors.sortOrder?.message}>
            <Input
              id="banner-sort-order"
              type="number"
              min={0}
              step="1"
              aria-invalid={!!errors.sortOrder}
              {...register("sortOrder", { valueAsNumber: true })}
            />
          </FormField>

          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch id="banner-active" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="banner-active">Active</Label>
              </div>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : null}
              {isEditMode ? "Save changes" : "Create banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BannersManager() {
  const { data: banners, isLoading, isError } = useAdminBannersQuery();
  const deleteMutation = useDeleteBannerMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<AdminBanner | null>(null);

  function openCreateDialog() {
    setEditingBanner(null);
    setIsFormOpen(true);
  }

  function openEditDialog(banner: AdminBanner) {
    setEditingBanner(banner);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deletingBanner) return;
    try {
      await deleteMutation.mutateAsync(deletingBanner.id);
      toast.success("Banner deleted.");
      setDeletingBanner(null);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  const sortedBanners = banners ? [...banners].sort((a, b) => a.sortOrder - b.sortOrder) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Banners</h1>
          <p className="text-sm text-muted-foreground">Manage the homepage promotional banners.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus /> New Banner
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading banners...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load banners.</p>}

      {sortedBanners && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBanners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No banners yet.
                  </TableCell>
                </TableRow>
              )}
              {sortedBanners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="text-muted-foreground">{banner.sortOrder}</TableCell>
                  <TableCell>
                    <p className="font-medium">{banner.title}</p>
                    <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {banner.ctaLabel} → {banner.ctaHref}
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "default" : "outline"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${banner.title}`}
                        onClick={() => openEditDialog(banner)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${banner.title}`}
                        onClick={() => setDeletingBanner(banner)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <BannerFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} banner={editingBanner} />

      <Dialog open={deletingBanner !== null} onOpenChange={(open) => !open && setDeletingBanner(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete banner?</DialogTitle>
            <DialogDescription>
              This will permanently remove &ldquo;{deletingBanner?.title}&rdquo;. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingBanner(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
