import "@testing-library/jest-dom";
import type { AnchorHTMLAttributes } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeaderMobileMenu } from "@/components/layout/header-mobile-menu";
import type { NavItem } from "@/domain/navigation";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        rest.onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

const links: NavItem[] = [
  { href: "/buy", label: "Buy", external: false },
  { href: "/rent", label: "Rent", external: false },
];

describe("HeaderMobileMenu", () => {
  it("renders nothing when links is empty", () => {
    const { container } = render(<HeaderMobileMenu links={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("does not show the panel by default", () => {
    render(<HeaderMobileMenu links={links} />);
    expect(screen.getByRole("button", { name: /menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("navigation", { name: "Móvil" })).not.toBeInTheDocument();
  });

  it("opens the panel when the toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<HeaderMobileMenu links={links} />);

    await user.click(screen.getByRole("button", { name: /menú/i }));

    expect(screen.getByRole("button", { name: /menú/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("navigation", { name: "Móvil" })).toBeInTheDocument();
  });

  it("closes the panel on a second toggle click", async () => {
    const user = userEvent.setup();
    render(<HeaderMobileMenu links={links} />);

    const toggle = screen.getByRole("button", { name: /menú/i });
    await user.click(toggle);
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Móvil" })).not.toBeInTheDocument();
  });

  it("closes the panel when a link inside is clicked", async () => {
    const user = userEvent.setup();
    render(<HeaderMobileMenu links={links} />);

    await user.click(screen.getByRole("button", { name: /menú/i }));
    await user.click(screen.getByRole("link", { name: "Buy" }));

    expect(screen.queryByRole("navigation", { name: "Móvil" })).not.toBeInTheDocument();
  });
});
