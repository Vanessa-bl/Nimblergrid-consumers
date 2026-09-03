import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyTypeDropdown } from "@/components/filters/PropertyTypeDropdown/PropertyTypeDropdown";

describe("PropertyTypeDropdown", () => {
  it("applies the toggled types without the Any token", async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();

    render(
      <PropertyTypeDropdown
        selectedTypes={[]}
        totalResults={128}
        onApply={onApply}
        onClear={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /^Property type/i }),
    );
    const dialog = screen.getByRole("dialog", { name: "Property type filter" });

    await user.click(within(dialog).getByRole("button", { name: "Apartment" }));
    await user.click(within(dialog).getByRole("button", { name: "Townhome" }));
    await user.click(
      within(dialog).getByRole("button", { name: "View 128 homes" }),
    );

    expect(onApply).toHaveBeenCalledWith(["Apartment", "Townhome"]);
  });

  it("shows Any as selected when nothing is chosen", async () => {
    const user = userEvent.setup();

    render(
      <PropertyTypeDropdown
        selectedTypes={[]}
        totalResults={128}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /^Property type/i }),
    );
    const dialog = screen.getByRole("dialog", { name: "Property type filter" });

    expect(within(dialog).getByRole("button", { name: "Any" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("clears the selection", async () => {
    const user = userEvent.setup();
    const onClear = jest.fn();

    render(
      <PropertyTypeDropdown
        selectedTypes={["Condo"]}
        totalResults={128}
        onApply={jest.fn()}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^1 type/i }));
    const dialog = screen.getByRole("dialog", { name: "Property type filter" });

    expect(
      within(dialog).getByRole("button", { name: "Condo" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(
      within(dialog).getByRole("button", { name: "Clear all" }),
    );
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("dialog", { name: "Property type filter" }),
    ).not.toBeInTheDocument();
  });
});
