import "@testing-library/jest-dom";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CurrencyInput,
  groupDigits,
  normalizeDigits,
} from "@/components/ui/form/CurrencyInput/CurrencyInput";

function ControlledCurrency() {
  const [digits, setDigits] = useState("");
  return (
    <CurrencyInput
      label="Estimated household income"
      value={digits}
      onValueChange={setDigits}
      suffix="/year"
    />
  );
}

describe("CurrencyInput", () => {
  it("renders prefix and suffix", () => {
    render(<CurrencyInput value="" onValueChange={jest.fn()} suffix="/year" />);

    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("/year")).toBeInTheDocument();
  });

  it("types digits and groups the display", async () => {
    const user = userEvent.setup();

    render(<ControlledCurrency />);
    const input = screen.getByLabelText("Estimated household income");
    await user.type(input, "90000");

    expect(input).toHaveValue("90,000");
  });

  it("strips separators and symbols from pasted content", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(<CurrencyInput value="" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.paste("$90,000");

    expect(onValueChange).toHaveBeenLastCalledWith("90000");
  });

  it("shows the formatted value in readOnly mode", () => {
    render(
      <CurrencyInput
        label="Estimated household income"
        value="90000"
        onValueChange={jest.fn()}
        readOnly
      />,
    );

    const input = screen.getByLabelText("Estimated household income");
    expect(input).toHaveValue("90,000");
    expect(input).toHaveAttribute("readonly");
  });

  it("caps the digit count", () => {
    expect(normalizeDigits("1234567890123")).toBe("123456789");
  });
});

describe("currency helpers", () => {
  it("groups plain digits with en-US separators", () => {
    expect(groupDigits("")).toBe("");
    expect(groupDigits("90000")).toBe("90,000");
    expect(groupDigits("1200.50")).toBe("120,050");
  });

  it("normalizes any raw string to plain digits", () => {
    expect(normalizeDigits("$ 1,200.50")).toBe("120050");
    expect(normalizeDigits("abc123")).toBe("123");
    expect(normalizeDigits("")).toBe("");
  });
});
