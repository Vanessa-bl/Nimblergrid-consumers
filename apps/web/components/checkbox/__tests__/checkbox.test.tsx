import "@testing-library/jest-dom";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, CheckboxControl } from "@/components/checkbox";

describe("Checkbox", () => {
  it("renders a checkbox associated with its label text", () => {
    render(<Checkbox label="Acepto los términos" />);

    const input = screen.getByRole("checkbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleName("Acepto los términos");
  });

  it("is uncontrolled by default: click toggles and notifies onChange", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Checkbox label="Opción" onChange={onChange} />);
    const input = screen.getByRole("checkbox");

    await user.click(input);
    expect(input).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText("Opción"));
    expect(input).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("is controlled: click only notifies onChange, never self-toggles", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(
      <Checkbox label="Opción" checked={false} onChange={onChange} />,
    );
    const input = screen.getByRole("checkbox");

    await user.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).not.toBeChecked();

    rerender(<Checkbox label="Opción" checked={true} onChange={onChange} />);
    expect(input).toBeChecked();
  });

  it("respects defaultChecked on first render", () => {
    render(<Checkbox label="Opción" defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("is disabled: click does not toggle and does not call onChange", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Checkbox label="Opción" disabled onChange={onChange} />);
    const input = screen.getByRole("checkbox");

    expect(input).toBeDisabled();
    await user.click(input);
    expect(input).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("syncs a later controlled checked prop (false -> true)", () => {
    const { rerender } = render(<Checkbox label="Opción" checked={false} />);
    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    rerender(<Checkbox label="Opción" checked={true} />);
    expect(input).toBeChecked();
  });

  it("renders the check icon ONLY when checked", () => {
    const { container, rerender } = render(
      <Checkbox label="Opción" checked={false} />,
    );
    expect(container.querySelector("svg")).toBeNull();

    rerender(<Checkbox label="Opción" checked />);
    expect(container.querySelector("svg")).not.toBeNull();

    rerender(<Checkbox label="Opción" checked={false} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("exposes the native input through ref (react-hook-form style)", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Opción" ref={ref} name="accept" value="yes" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.name).toBe("accept");
    expect(ref.current?.value).toBe("yes");
    expect(ref.current?.type).toBe("checkbox");
  });

  it("renders description text under the label", () => {
    render(
      <Checkbox
        label="Opción"
        description="Recibir novedades por correo"
        defaultChecked
      />,
    );

    expect(screen.getByText("Recibir novedades por correo")).toBeInTheDocument();
  });
});

describe("CheckboxControl", () => {
  it("works standalone (uncontrolled) without label text", async () => {
    const user = userEvent.setup();
    render(<CheckboxControl aria-label="Seleccionar fila" />);

    const input = screen.getByRole("checkbox");
    expect(input).toHaveAccessibleName("Seleccionar fila");

    await user.click(input);
    expect(input).toBeChecked();
  });

  it("toggles when clicking the visual cell (any point of the 32px label)", async () => {
    const user = userEvent.setup();
    const { container } = render(<CheckboxControl aria-label="Fila" />);

    const input = screen.getByRole("checkbox");
    const cell = container.querySelector("label");
    expect(cell).not.toBeNull();

    await user.click(cell as HTMLLabelElement);
    expect(input).toBeChecked();

    await user.click(cell as HTMLLabelElement);
    expect(input).not.toBeChecked();
  });

  it("forwards className to the input and stays controlled-safe", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <CheckboxControl
        aria-label="Fila"
        checked={false}
        className="custom-input"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("checkbox");

    expect(input).toHaveClass("custom-input");
    await user.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).not.toBeChecked();
  });
});
