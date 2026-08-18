import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PriceDisplay } from "@/components/product/price-display";

describe("PriceDisplay", () => {
  it("should render only the price when there is no compareAtPrice", () => {
    render(<PriceDisplay price={999} />);

    expect(screen.getByText("₹999")).toBeInTheDocument();
    expect(screen.queryByText(/line-through/)).not.toBeInTheDocument();
  });

  it("should render a struck-through compareAtPrice when it is greater than the price", () => {
    render(<PriceDisplay price={750} compareAtPrice={1000} />);

    expect(screen.getByText("₹750")).toBeInTheDocument();
    expect(screen.getByText("₹1,000")).toBeInTheDocument();
  });

  it("should not render a strikethrough price when compareAtPrice is not greater than price", () => {
    render(<PriceDisplay price={999} compareAtPrice={999} />);

    expect(screen.getAllByText("₹999")).toHaveLength(1);
  });
});
