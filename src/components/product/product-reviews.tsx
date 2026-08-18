"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RatingInput } from "@/components/product/rating-input";
import { RatingStars } from "@/components/product/rating-stars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { EmptyState } from "@/components/shared/empty-state";
import { useSession } from "@/hooks/use-auth";
import { useCreateReviewMutation } from "@/hooks/use-reviews";
import { ApiRequestError } from "@/lib/api-client";
import { createReviewSchema, type CreateReviewInput } from "@/lib/validation/review.schema";
import type { Review } from "@/types/review.types";
import { MessageSquare } from "lucide-react";

function formatReviewDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function WriteReviewDialog({ productSlug }: { productSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const createReviewMutation = useCreateReviewMutation(productSlug);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
    setError,
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: { rating: 0, title: "", comment: "" },
  });

  const rating = watch("rating");

  async function onSubmit(data: CreateReviewInput) {
    try {
      const result = await createReviewMutation.mutateAsync(data);
      toast.success(result.message);
      reset({ rating: 0, title: "", comment: "" });
      setIsOpen(false);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Write a review</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

          <FormField label="Rating" htmlFor="rating" error={errors.rating?.message}>
            <RatingInput value={rating} onChange={(value) => setValue("rating", value, { shouldValidate: true })} />
          </FormField>

          <FormField label="Title" htmlFor="review-title" error={errors.title?.message}>
            <Input id="review-title" {...register("title")} aria-invalid={!!errors.title} />
          </FormField>

          <FormField label="Review" htmlFor="review-comment" error={errors.comment?.message}>
            <Textarea id="review-comment" rows={4} {...register("comment")} aria-invalid={!!errors.comment} />
          </FormField>

          <DialogFooter>
            <Button type="submit" disabled={createReviewMutation.isPending}>
              {createReviewMutation.isPending ? "Submitting..." : "Submit review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProductReviews({ productSlug, reviews }: { productSlug: string; reviews: Review[] }) {
  const { data: user } = useSession();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        {user ? (
          <WriteReviewDialog productSlug={productSlug} />
        ) : (
          <Button variant="outline" render={<Link href="/login" />} nativeButton={false}>
            Sign in to write a review
          </Button>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to review this product." />
      ) : (
        <ul className="flex flex-col gap-6">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-border pb-6 last:border-b-0">
              <div className="flex items-center justify-between">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">{formatReviewDate(review.createdAt)}</span>
              </div>
              <h3 className="mt-2 font-medium">{review.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
              <p className="mt-2 text-xs font-medium text-foreground">{review.userName}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
