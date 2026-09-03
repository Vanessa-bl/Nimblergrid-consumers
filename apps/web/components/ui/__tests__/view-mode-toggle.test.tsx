import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewModeToggle } from "@/components/ui/view-mode-toggle";

const LIST_MAP_OPTIONS = [
  { label: "List", value: "list" },
  { label: "Map", value: "map" },
] as const;

describe("ViewModeToggle", () => {
  it("renders tabs with tablist semantics", () => {
    render(<ViewModeToggle options={LIST_MAP_OPTIONS} />);

    expect(screen.getByRole("tablist", { name: "View options" })).toBeInTheDocument();
    const listTab = screen.getByRole("tab", { name: "List" });
    const mapTab = screen.getByRole("tab", { name: "Map" });

    expect(listTab).toHaveAttribute("aria-selected", "true");
    expect(mapTab).toHaveAttribute("aria-selected", "false");
    expect(listTab).toHaveAttribute("tabindex", "0");
    expect(mapTab).toHaveAttribute("tabindex", "-1");
  });

  it("selects the defaultValue when uncontrolled", () => {
    render(
      <ViewModeToggle options={LIST_MAP_OPTIONS} defaultValue="map" />,
    );

    expect(screen.getByRole("tab", { name: "Map" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "List" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("updates its own state when uncontrolled", async () => {
    const user = userEvent.setup();

    render(<ViewModeToggle options={LIST_MAP_OPTIONS} />);

    await user.click(screen.getByRole("tab", { name: "Map" }));
    expect(screen.getByRole("tab", { name: "Map" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "List" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("acts controlled: only notifies onChange, parent decides", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(
      <ViewModeToggle
        options={LIST_MAP_OPTIONS}
        value="list"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Map" }));
    expect(onChange).toHaveBeenCalledWith("map");
    expect(screen.getByRole("tab", { name: "Map" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    rerender(
      <ViewModeToggle
        options={LIST_MAP_OPTIONS}
        value="map"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("tab", { name: "Map" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("navigates with arrow keys and wraps around", () => {
    const onChange = jest.fn();

    render(
      <ViewModeToggle
        options={LIST_MAP_OPTIONS}
        defaultValue="list"
        onChange={onChange}
      />,
    );

    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("map");
    expect(screen.getByRole("tab", { name: "Map" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Map" })).toHaveFocus();

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("list");
    expect(screen.getByRole("tab", { name: "List" })).toHaveFocus();

    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("map");
    expect(screen.getByRole("tab", { name: "Map" })).toHaveFocus();
  });

  it("supports generic value types beyond strings", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <ViewModeToggle
        options={[
          { label: "Compact", value: 1 },
          { label: "Comfort", value: 2 },
        ]}
        defaultValue={1}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Comfort" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
