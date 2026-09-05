import "@testing-library/jest-dom";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "@/components/form/TextField/TextField";

describe("TextField", () => {
  it("associates the label with the input", () => {
    render(<TextField label="Nombre completo" />);

    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
  });

  it("marks required fields with asterisk and aria-required", () => {
    render(<TextField label="Email" required />);

    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("aria-required", "true");
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows helper text wired via aria-describedby", () => {
    render(<TextField label="Email" helper="No lo compartimos con nadie." />);

    const input = screen.getByLabelText("Email");
    const helper = screen.getByText("No lo compartimos con nadie.");
    expect(helper).toHaveClass("text-zinc-500");
    expect(input.getAttribute("aria-describedby")).toBe(helper.id);
  });

  it("shows the error, sets aria-invalid and hides the helper", () => {
    render(
      <TextField
        label="Email"
        helper="No lo compartimos con nadie."
        error="Ingresá un email válido."
      />,
    );

    const input = screen.getByLabelText("Email");
    const error = screen.getByText("Ingresá un email válido.");
    expect(error).toHaveClass("text-rose-600");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toBe(error.id);
    expect(screen.queryByText("No lo compartimos con nadie.")).not.toBeInTheDocument();
  });

  it("renders start and end adornments as decorative", () => {
    render(
      <TextField
        label="Ingreso"
        startAdornment="$"
        endAdornment="/year"
      />,
    );

    expect(screen.getByText("$")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("/year")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports readOnly without disabling focus semantics", () => {
    render(<TextField label="Email" readOnly value="hola@hallo.one" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("readonly");
    expect(input).not.toBeDisabled();
  });

  it("supports disabled state", () => {
    render(<TextField label="Email" disabled />);

    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("forwards the ref to the native input", () => {
    const ref = createRef<HTMLInputElement>();

    render(<TextField label="Nombre" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("lets the user type into the field", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<TextField label="Nombre" onChange={onChange} />);
    await user.type(screen.getByLabelText("Nombre"), "Iraima");

    expect(onChange).toHaveBeenCalledTimes(6);
  });
});
