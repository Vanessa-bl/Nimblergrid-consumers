import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/Pagination/Pagination";

describe("Pagination", () => {
  it("renders nothing when there is a single page", () => {
    const { container } = render(
      <Pagination page={1} pageCount={1} onPageChange={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page with aria-current", () => {
    render(<Pagination page={3} pageCount={5} onPageChange={jest.fn()} />);

    const current = screen.getByRole("button", { name: "3" });
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange when a page number is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "2" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous on the first page and next on the last page", () => {
    const { rerender } = render(
      <Pagination page={1} pageCount={5} onPageChange={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeEnabled();

    rerender(<Pagination page={5} pageCount={5} onPageChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Página anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeDisabled();
  });

  it("moves one page with the next button", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "Página anterior" }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("shows ellipsis gaps for large page counts", () => {
    render(<Pagination page={5} pageCount={10} onPageChange={jest.fn()} />);

    const nav = screen.getByRole("navigation", { name: "Paginación" });
    const pages = within(nav)
      .getAllByRole("button")
      .map((button) => button.textContent)
      .filter((text) => text !== null && text.trim() !== "");

    expect(pages).toEqual(["1", "4", "5", "6", "10"]);
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("keeps boundaries and siblings visible next to the current page", () => {
    render(<Pagination page={1} pageCount={8} onPageChange={jest.fn()} />);

    const nav = screen.getByRole("navigation", { name: "Paginación" });
    const pages = within(nav)
      .getAllByRole("button")
      .map((button) => button.textContent)
      .filter((text) => text !== null && text.trim() !== "");

    expect(pages).toEqual(["1", "2", "8"]);
  });

  it("supports the disabled state for the whole control", () => {
    render(
      <Pagination page={3} pageCount={5} disabled onPageChange={jest.fn()} />,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });
});
