"use client";

import { toast } from "sonner";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RatingStars } from "@/components/product/rating-stars";
import {
  useAdminReviewsQuery,
  useProductNameLookupQuery,
  useUpdateReviewStatusMutation,
} from "@/hooks/use-admin-reviews";
import { ApiRequestError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { ReviewStatus, type Review } from "@/types/review.types";

const REVIEW_STATUS_STYLES: Record<ReviewStatus, string> = {
  [ReviewStatus.PENDING]: "bg-muted text-muted-foreground border-transparent",
  [ReviewStatus.APPROVED]: "bg-success/10 text-success border-transparent",
  [ReviewStatus.REJECTED]: "bg-destructive/10 text-destructive border-transparent",
};

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return <Badge className={cn(REVIEW_STATUS_STYLES[status])}>{status}</Badge>;
}

function ReviewActions({ review }: { review: Review }) {
  const updateMutation = useUpdateReviewStatusMutation();

  async function updateStatus(status: ReviewStatus) {
    try {
      await updateMutation.mutateAsync({ id: review.id, input: { status } });
      toast.success(`Review by ${review.userName} ${status === ReviewStatus.APPROVED ? "approved" : "rejected"}.`);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={updateMutation.isPending || review.status === ReviewStatus.APPROVED}
        onClick={() => updateStatus(ReviewStatus.APPROVED)}
      >
        <Check /> Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={updateMutation.isPending || review.status === ReviewStatus.REJECTED}
        onClick={() => updateStatus(ReviewStatus.REJECTED)}
      >
        <X /> Reject
      </Button>
    </div>
  );
}

export function ReviewsManager() {
  const { data: reviews, isLoading, isError } = useAdminReviewsQuery();
  const { data: productNamesById } = useProductNameLookupQuery();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="text-sm text-muted-foreground">Moderate customer reviews before they go live.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading reviews...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load reviews.</p>}

      {reviews && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No reviews yet.
                  </TableCell>
                </TableRow>
              )}
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="max-w-40 truncate font-medium">
                    {productNamesById?.get(review.productId) ?? review.productId}
                  </TableCell>
                  <TableCell>
                    <RatingStars rating={review.rating} />
                  </TableCell>
                  <TableCell className="max-w-72">
                    <p className="font-medium">{review.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{review.comment}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{review.userName}</TableCell>
                  <TableCell>
                    <ReviewStatusBadge status={review.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ReviewActions review={review} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
