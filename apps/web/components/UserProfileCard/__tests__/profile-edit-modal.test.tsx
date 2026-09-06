import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileEditModal } from "@/components/UserProfileCard/ProfileEditModal";
import type { UserProfileData } from "@/components/UserProfileCard/UserProfileCard.types";

const PROFILE: UserProfileData = {
  id: "p1",
  name: "Iraima Hurtado",
  phone: "+54 11 5555 0101",
  email: "iraima@hallo.one",
  avatarUrl: null,
};

describe("ProfileEditModal", () => {
  it("opens a dialog with the profile values pre-filled", () => {
    render(<ProfileEditModal profile={PROFILE} onSave={jest.fn()} onClose={jest.fn()} />);

    const dialog = screen.getByRole("dialog", { name: "Editar datos" });
    expect(dialog).toBeVisible();
    expect(screen.getByLabelText(/Nombre/)).toHaveValue("Iraima Hurtado");
    expect(screen.getByLabelText(/Teléfono/)).toHaveValue("+54 11 5555 0101");
    expect(screen.getByLabelText(/Email/)).toHaveValue("iraima@hallo.one");
  });

  it("saves the edited values trimmed via onSave", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<ProfileEditModal profile={PROFILE} onSave={onSave} onClose={jest.fn()} />);
    const nameInput = screen.getByLabelText(/Nombre/);
    await user.clear(nameInput);
    await user.type(nameInput, "Marta Rossi");

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSave).toHaveBeenCalledWith({
      id: "p1",
      name: "Marta Rossi",
      phone: "+54 11 5555 0101",
      email: "iraima@hallo.one",
      avatarUrl: null,
    });
  });

  it("shows validation errors and does not save with empty required fields", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<ProfileEditModal profile={PROFILE} onSave={onSave} onClose={jest.fn()} />);
    const nameInput = screen.getByLabelText(/Nombre/);
    await user.clear(nameInput);
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Ingresá tu nombre.")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<ProfileEditModal profile={PROFILE} onSave={onSave} onClose={jest.fn()} />);
    const emailInput = screen.getByLabelText(/Email/);
    await user.clear(emailInput);
    await user.type(emailInput, "no-es-un-email");

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Ingresá un email válido.")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<ProfileEditModal profile={PROFILE} onSave={jest.fn()} onClose={onClose} />);
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes with Cancelar and the close button", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<ProfileEditModal profile={PROFILE} onSave={jest.fn()} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
