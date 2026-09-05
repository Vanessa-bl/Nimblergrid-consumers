import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar } from "@/components/avatar/Avatar";

describe("Avatar", () => {
  it("renders initials from the first letters of the first two words", () => {
    render(<Avatar name="Iraima Hurtado" />);

    const initials = screen.getByText("IH");
    expect(initials).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Iraima Hurtado")).toHaveClass("sr-only");
  });

  it("renders the first two letters of a single-word name", () => {
    render(<Avatar name="Iraima" />);

    expect(screen.getByText("Ir")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Iraima")).toHaveClass("sr-only");
  });

  it("falls back to initials when the image fails to load", () => {
    const { container } = render(
      <Avatar name="Iraima Hurtado" avatarUrl="https://example.com/avatar.jpg" />,
    );

    const image = screen.getByRole("img", { name: "Iraima Hurtado" });
    expect(image.tagName).toBe("IMG");

    fireEvent.error(image);

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("IH")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Iraima Hurtado")).toHaveClass("sr-only");
  });

  it("retries the image when avatarUrl changes after an error", () => {
    const { container, rerender } = render(
      <Avatar name="Iraima" avatarUrl="https://example.com/broken.jpg" />,
    );

    fireEvent.error(screen.getByRole("img"));
    expect(container.querySelector("img")).toBeNull();

    rerender(<Avatar name="Iraima" avatarUrl="https://example.com/ok.jpg" />);
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("renders a decorative silhouette when there is no name", () => {
    const { container } = render(<Avatar />);

    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("span[aria-hidden='true']")).toBeInTheDocument();
  });

  it("applies the requested size and tone classes and merges className", () => {
    render(
      <Avatar name="Ana García" size="lg" tone="dark" className="mx-auto" />,
    );

    const avatar = screen.getByText("Ana García").parentElement;
    expect(avatar).toHaveClass("h-[72px]", "w-[72px]", "bg-zinc-900", "mx-auto");
  });

  it("uses alt as accessible name and treats alt='' as decorative", () => {
    const { rerender } = render(
      <Avatar
        name="Iraima Hurtado"
        alt="Foto de Iraima"
        avatarUrl="https://example.com/foto.jpg"
      />,
    );
    expect(
      screen.getByRole("img", { name: "Foto de Iraima" }),
    ).toBeInTheDocument();

    rerender(<Avatar name="Iraima Hurtado" alt="" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("IH")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByText("Iraima Hurtado")).not.toBeInTheDocument();
  });
});
