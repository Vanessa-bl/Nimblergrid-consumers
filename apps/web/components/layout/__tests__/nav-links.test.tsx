import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { NavLinks } from "@/components/layout/nav-links";
import type { NavItem } from "@/domain/navigation";

const items: NavItem[] = [
  { href: "/buy", label: "Buy", external: false },
  { href: "https://ext.com", label: "External", external: true },
];

describe("NavLinks", () => {
  it("renders each item as a link with the correct href", () => {
    render(<NavLinks items={items} />);
    expect(screen.getByRole("link", { name: "Buy" })).toHaveAttribute("href", "/buy");
    expect(screen.getByRole("link", { name: "External" })).toHaveAttribute(
      "href",
      "https://ext.com",
    );
  });

  it("applies target=_blank and rel to external items", () => {
    render(<NavLinks items={items} />);
    const external = screen.getByRole("link", { name: "External" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not set target=_blank on internal items", () => {
    render(<NavLinks items={items} />);
    expect(screen.getByRole("link", { name: "Buy" })).not.toHaveAttribute("target");
  });

  it("renders nothing when items is empty", () => {
    const { container } = render(<NavLinks items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("exposes the provided aria-label on the nav landmark", () => {
    render(<NavLinks items={items} ariaLabel="Mobile" />);
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
  });

  it("defaults the aria-label to Principal", () => {
    render(<NavLinks items={items} />);
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
  });
});
