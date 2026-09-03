import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FiltersSidebar,
  FiltersSidebarButton,
} from "@/components/filters/FiltersSidebar/FiltersSidebar";

function renderOpenSidebar(overrides?: Partial<Parameters<typeof FiltersSidebar>[0]>) {
  const onClose = jest.fn();
  const onApplyFilters = jest.fn();
  const onClearAll = jest.fn();

  render(
    <FiltersSidebar
      isOpen={true}
      totalResults={30}
      onApplyFilters={onApplyFilters}
      onClearAll={onClearAll}
      onClose={onClose}
      {...overrides}
    />,
  );

  return { onClose, onApplyFilters, onClearAll };
}

describe("FiltersSidebar", () => {
  it("renders the dialog with sections when open", () => {
    renderOpenSidebar();

    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Rooms")).toBeInTheDocument();
    expect(screen.getByText("Home type")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View 30 homes" })).toBeInTheDocument();
  });

  it("closes on Escape and on the close button", async () => {
    const user = userEvent.setup();
    const { onClose } = renderOpenSidebar();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Close filters" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("locks body scroll while open and restores it after close", () => {
    const { rerender } = render(
      <FiltersSidebar
        isOpen={true}
        totalResults={30}
        onApplyFilters={jest.fn()}
        onClearAll={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <FiltersSidebar
        isOpen={false}
        totalResults={30}
        onApplyFilters={jest.fn()}
        onClearAll={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("emits the filters and closes when applying", async () => {
    const user = userEvent.setup();
    const { onApplyFilters, onClose } = renderOpenSidebar();

    await user.click(screen.getByRole("button", { name: "View 30 homes" }));
    expect(onApplyFilters).toHaveBeenCalledTimes(1);
    expect(onApplyFilters.mock.calls[0][0]).toMatchObject({
      priceMin: null,
      priceMax: null,
      bedrooms: [],
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears state and notifies on Clear all", async () => {
    const user = userEvent.setup();
    const { onClearAll } = renderOpenSidebar();

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("keeps closed state hidden and non-interactive", () => {
    const { container } = render(
      <FiltersSidebar
        isOpen={false}
        totalResults={30}
        onApplyFilters={jest.fn()}
        onClearAll={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.parentElement).toHaveAttribute("aria-hidden", "true");
  });
});

describe("FiltersSidebarButton", () => {
  it("shows the filter icon and reflects open/value states", () => {
    const onClick = jest.fn();

    render(
      <FiltersSidebarButton
        isOpen={false}
        hasValue={false}
        onClick={onClick}
      />,
    );

    const button = screen.getByRole("button", { name: /Filters/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).not.toHaveAttribute("aria-pressed");
  });

  it("fires onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<FiltersSidebarButton onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: /Filters/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
