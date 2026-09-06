import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoTooltip } from "@/components/form/InfoTooltip/InfoTooltip";

describe("InfoTooltip", () => {
  it("renders a help button with an accessible label", () => {
    render(<InfoTooltip content="Ayuda extra." />);

    expect(screen.getByRole("button", { name: "Más información" })).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens the tooltip on click", async () => {
    const user = userEvent.setup();

    render(<InfoTooltip content="Ayuda extra." />);
    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent("Ayuda extra.");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();

    render(<InfoTooltip content="Ayuda extra." />);
    await user.click(screen.getByRole("button"));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();

    render(<InfoTooltip content="Ayuda extra." />);
    await user.click(screen.getByRole("button"));
    fireEvent.pointerDown(document.body);

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("toggles closed when clicking the button again", async () => {
    const user = userEvent.setup();

    render(<InfoTooltip content="Ayuda extra." />);
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("accepts a custom label", () => {
    render(<InfoTooltip content="Ayuda." label="¿Qué significa esto?" />);

    expect(screen.getByRole("button", { name: "¿Qué significa esto?" })).toBeInTheDocument();
  });
});
