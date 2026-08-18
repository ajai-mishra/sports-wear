"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/hooks/use-admin-categories";
import { ApiRequestError } from "@/lib/api-client";
import { adminCreateCategorySchema, type AdminCreateCategoryInput } from "@/lib/validation/admin-category.schema";
import type { Category } from "@/types/category.types";

const NO_PARENT_VALUE = "__none__";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  categories: Category[];
}

function CategoryFormDialog({ open, onOpenChange, category, categories }: CategoryFormDialogProps) {
  const isEditMode = category !== null;
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<AdminCreateCategoryInput>({
    resolver: zodResolver(adminCreateCategorySchema),
    defaultValues: { slug: "", name: "", description: "", imageUrl: "", parentId: null },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      category
        ? {
            slug: category.slug,
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl,
            parentId: category.parentId,
          }
        : { slug: "", name: "", description: "", imageUrl: "", parentId: null },
    );
  }, [open, category, reset]);

  async function onSubmit(data: AdminCreateCategoryInput) {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id: category.id, input: data });
        toast.success("Category updated.");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Category created.");
      }
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      setError("root", { message });
    }
  }

  const parentOptions = categories.filter((candidate) => candidate.id !== category?.id);
  const parentValue = watch("parentId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update this category's details." : "Add a new product category."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          {errors.root && (
            <p className="text-sm text-destructive" role="alert">
              {errors.root.message}
            </p>
          )}

          <FormField label="Name" htmlFor="category-name" error={errors.name?.message}>
            <Input id="category-name" aria-invalid={!!errors.name} {...register("name")} />
          </FormField>

          <FormField label="Slug" htmlFor="category-slug" error={errors.slug?.message}>
            <Input id="category-slug" aria-invalid={!!errors.slug} {...register("slug")} />
          </FormField>

          <FormField label="Description" htmlFor="category-description" error={errors.description?.message}>
            <Textarea
              id="category-description"
              rows={3}
              aria-invalid={!!errors.description}
              {...register("description")}
            />
          </FormField>

          <FormField label="Image URL" htmlFor="category-image" error={errors.imageUrl?.message}>
            <Input id="category-image" aria-invalid={!!errors.imageUrl} {...register("imageUrl")} />
          </FormField>

          <FormField label="Parent category" htmlFor="category-parent">
            <Select
              value={parentValue ?? NO_PARENT_VALUE}
              onValueChange={(value) => setValue("parentId", value === NO_PARENT_VALUE ? null : value)}
            >
              <SelectTrigger id="category-parent" className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT_VALUE}>None</SelectItem>
                {parentOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : null}
              {isEditMode ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoriesManager() {
  const { data: categories, isLoading, isError } = useAdminCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  function openCreateDialog() {
    setEditingCategory(null);
    setIsFormOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deletingCategory) return;
    try {
      await deleteMutation.mutateAsync(deletingCategory.id);
      toast.success("Category deleted.");
      setDeletingCategory(null);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage the categories products are organized under.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus /> New Category
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading categories...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load categories.</p>}

      {categories && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No categories yet.
                  </TableCell>
                </TableRow>
              )}
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.parentId
                      ? (categories.find((candidate) => candidate.id === category.parentId)?.name ?? "—")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${category.name}`}
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => setDeletingCategory(category)}
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

      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={editingCategory}
        categories={categories ?? []}
      />

      <Dialog open={deletingCategory !== null} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              This will permanently remove &ldquo;{deletingCategory?.name}&rdquo;. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
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
