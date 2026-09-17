import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PillSelect } from "@/components/ui/form/PillSelect/PillSelect";
import type { PillOption } from "@/components/ui/form/PillSelect/PillSelect.types";

const PETS_OPTIONS: readonly PillOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

describe("PillSelect", () => {
  it("renders a labelled radiogroup with radio options", () => {
    render(
      <PillSelect
        label="Pets"
        options={PETS_OPTIONS}
        value={null}
        onChange={jest.fn()}
      />,
    );

    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAccessibleName("Pets");

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAccessibleName("Yes");
    expect(radios[1]).toHaveAccessibleName("No");
  });

  it("gives every radio the same group name", () => {
    render(
      <PillSelect
        label="Pets"
        options={PETS_OPTIONS}
        value="yes"
        onChange={jest.fn()}
      />,
    );

    const [first, second] = screen.getAllByRole("radio");
    expect(first).toHaveAttribute("name");
    expect(second).toHaveAttribute("name", first.getAttribute("name"));
  });

  it("reflects the selected value as checked", () => {
    render(
      <PillSelect
        label="Pets"
        options={PETS_OPTIONS}
        value="no"
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("radio", { name: "No" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Yes" })).not.toBeChecked();
  });

  it("calls onChange with the option value on selection", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <PillSelect label="Pets" options={PETS_OPTIONS} value={null} onChange={onChange} />,
    );

    await user.click(screen.getByRole("radio", { name: "Yes" }));
    expect(onChange).toHaveBeenCalledWith("yes");
  });

  it("ignores clicks on disabled options", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const options: readonly PillOption[] = [
      { value: "yes", label: "Yes", disabled: true },
      { value: "no", label: "No" },
    ];

    render(<PillSelect label="Pets" options={options} value={null} onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "Yes" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables the whole group", () => {
    render(
      <PillSelect label="Pets" options={PETS_OPTIONS} value={null} onChange={jest.fn()} disabled />,
    );

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("supports keyboard arrow navigation between radios", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <PillSelect
        label="Pets"
        options={PETS_OPTIONS}
        value={null}
        onChange={onChange}
      />,
    );

    const radios = screen.getAllByRole("radio");
    radios[0].focus();
    await user.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenCalledWith("no");
  });

  it("marks required groups and shows error messages", () => {
    render(
      <PillSelect
        label="Pets"
        required
        options={PETS_OPTIONS}
        value={null}
        onChange={jest.fn()}
        error="Elegí una opción."
      />,
    );

    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-required", "true");
    expect(screen.getByText("Elegí una opción.")).toBeInTheDocument();
    expect(group.getAttribute("aria-describedby")).toBe(
      screen.getByText("Elegí una opción.").id,
    );
  });
});
