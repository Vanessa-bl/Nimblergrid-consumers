import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterChipButton } from "@/features/filters/FilterChipButton/FilterChipButton";

describe("FilterChipButton", () => {
  it("renders the label and reflects the open state via aria-expanded", () => {
    const { rerender } = render(
      <FilterChipButton label="Price" isOpen={false} onClick={jest.fn()} />,
    );

    const chip = screen.getByRole("button", { name: /Price/i });
    expect(chip).toHaveAttribute("aria-expanded", "false");

    rerender(<FilterChipButton label="Price" isOpen={true} onClick={jest.fn()} />);
    expect(screen.getByRole("button", { name: /Price/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("fires onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<FilterChipButton label="Rooms" onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: /Rooms/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("behaves as a toggle with aria-pressed when selected is provided", () => {
    const { rerender } = render(
      <FilterChipButton label="Demo toggle" selected={false} onClick={jest.fn()} />,
    );

    const chip = screen.getByRole("button", { name: "Demo toggle" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).not.toHaveAttribute("aria-expanded");

    rerender(
      <FilterChipButton label="Demo toggle" selected={true} onClick={jest.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Demo toggle" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
