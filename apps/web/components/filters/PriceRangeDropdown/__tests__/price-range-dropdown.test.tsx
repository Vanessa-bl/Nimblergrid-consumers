import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PriceRangeDropdown } from "@/components/filters/PriceRangeDropdown/PriceRangeDropdown";

describe("PriceRangeDropdown", () => {
  it("opens the dialog from the chip and shows the footer actions", async () => {
    const user = userEvent.setup();

    render(
      <PriceRangeDropdown
        minPrice={null}
        maxPrice={null}
        onlySpecials={false}
        totalResults={128}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Price/i }));
    expect(screen.getByRole("dialog", { name: "Price filter" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "View 128 homes" }),
    ).toBeInTheDocument();
  });

  it("applies the selected min via select and keeps max unset", async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();

    render(
      <PriceRangeDropdown
        minPrice={null}
        maxPrice={null}
        onlySpecials={false}
        totalResults={128}
        onApply={onApply}
        onClear={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Price/i }));
    const dialog = screen.getByRole("dialog", { name: "Price filter" });

    await user.selectOptions(
      within(dialog).getByRole("combobox", { name: "Minimum price" }),
      "750",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "View 128 homes" }),
    );

    expect(onApply).toHaveBeenCalledWith({ min: 750, max: null, specials: false });
    expect(screen.queryByRole("dialog", { name: "Price filter" })).not.toBeInTheDocument();
  });

  it("includes rent specials and supports Clear all", async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();
    const onClear = jest.fn();

    render(
      <PriceRangeDropdown
        minPrice={null}
        maxPrice={null}
        onlySpecials={false}
        totalResults={128}
        onApply={onApply}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Price/i }));
    const dialog = screen.getByRole("dialog", { name: "Price filter" });

    await user.click(
      within(dialog).getByRole("checkbox", {
        name: /rent specials/i,
      }),
    );
    expect(
      within(dialog).getByRole("checkbox", { name: /rent specials/i }),
    ).toBeChecked();

    await user.click(
      within(dialog).getByRole("button", { name: "View 128 homes" }),
    );
    expect(onApply).toHaveBeenCalledWith({ min: null, max: null, specials: true });

    await user.click(screen.getByRole("button", { name: /^Price/i }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Clear all",
      }),
    );
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
