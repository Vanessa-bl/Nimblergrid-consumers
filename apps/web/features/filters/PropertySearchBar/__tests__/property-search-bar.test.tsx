import "@testing-library/jest-dom";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertySearchBar } from "@/features/filters/PropertySearchBar/PropertySearchBar";

function ControlledHarness({
  onSubmit,
}: Readonly<{ onSubmit?: (value: string) => void }>) {
  const [value, setValue] = useState("");
  return (
    <PropertySearchBar
      value={value}
      onValueChange={setValue}
      onSearchSubmit={onSubmit}
    />
  );
}

describe("PropertySearchBar", () => {
  it("renders the input with value and placeholder", () => {
    render(
      <PropertySearchBar
        placeholder='Try "Southlake, TX"'
        value="Villa Crespo"
        onValueChange={jest.fn()}
      />,
    );

    const input = screen.getByRole("searchbox", { name: "Search properties" });
    expect(input).toHaveValue("Villa Crespo");
    expect(input).toHaveAttribute("placeholder", 'Try "Southlake, TX"');
  });

  it("notifies onValueChange while typing", async () => {
    const user = userEvent.setup();

    render(<ControlledHarness />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "Palermo");
    expect(input).toHaveValue("Palermo");
  });

  it("submits on Enter and on search button click", async () => {
    const user = userEvent.setup();
    const onSearchSubmit = jest.fn();

    render(<ControlledHarness onSubmit={onSearchSubmit} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "Palermo{Enter}");
    expect(onSearchSubmit).toHaveBeenCalledWith("Palermo");

    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearchSubmit).toHaveBeenCalledWith("Palermo");
    expect(onSearchSubmit).toHaveBeenCalledTimes(2);
  });
});
