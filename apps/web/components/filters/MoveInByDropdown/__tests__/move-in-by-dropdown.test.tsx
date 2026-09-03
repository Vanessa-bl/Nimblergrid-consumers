import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoveInByDropdown } from "@/components/filters/MoveInByDropdown/MoveInByDropdown";

describe("MoveInByDropdown", () => {
  it("emits the chosen date and closes on Done", async () => {
    const user = userEvent.setup();
    const onDateChange = jest.fn();
    const onDone = jest.fn();

    render(
      <MoveInByDropdown
        selectedDate={null}
        onDateChange={onDateChange}
        onDone={onDone}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Move-in by/i }));
    const dialog = screen.getByRole("dialog", { name: "Move-in by filter" });

    const dateInput = within(dialog).getByLabelText("Move-in date");
    fireEvent.change(dateInput, { target: { value: "2026-12-15" } });
    expect(onDateChange).toHaveBeenCalledWith("2026-12-15");

    await user.click(
      within(dialog).getByRole("button", { name: "Done" }),
    );
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("dialog", { name: "Move-in by filter" }),
    ).not.toBeInTheDocument();
  });

  it("shows the formatted date in the chip when a date is selected", () => {
    render(
      <MoveInByDropdown
        selectedDate="2026-12-15"
        onDateChange={jest.fn()}
        onDone={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Move-in by 12/15/26" }),
    ).toBeInTheDocument();
  });

  it("closes with Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();

    render(
      <MoveInByDropdown
        selectedDate={null}
        onDateChange={jest.fn()}
        onDone={jest.fn()}
      />,
    );

    const trigger = screen.getByRole("button", { name: /^Move-in by/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Move-in by filter" })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Move-in by filter" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
