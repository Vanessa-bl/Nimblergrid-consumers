import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfileCard } from "@/features/profile/UserProfileCard/UserProfileCard";
import {
  magentoCustomerToUserData,
  supabaseProfileToUserData,
  type MagentoCustomer,
  type SupabaseProfileRow,
  type UserProfileData,
} from "@/domain/user-profile";

const profile: UserProfileData = {
  id: "u1",
  name: "Iraima Hurtado",
  phone: "+54 11 4824 0900",
  email: "iraima@hallo.com.ar",
};

describe("UserProfileCard", () => {
  it("renders header, name, avatar initials and contact rows", () => {
    render(<UserProfileCard data={profile} description="Datos de contacto" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Tus datos" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Datos de contacto")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Iraima Hurtado" }),
    ).toBeInTheDocument();
    expect(screen.getByText("+54 11 4824 0900")).toBeInTheDocument();
    expect(screen.getByText("iraima@hallo.com.ar")).toBeInTheDocument();
    expect(screen.getByText("IH")).toBeInTheDocument();
  });

  it("omits empty contact rows but keeps the name", () => {
    render(<UserProfileCard data={{ ...profile, phone: "", email: "" }} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Iraima Hurtado" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("+54 11 4824 0900")).not.toBeInTheDocument();
    expect(screen.queryByText("iraima@hallo.com.ar")).not.toBeInTheDocument();
  });

  it("shows the skeleton while loading without interactive controls", () => {
    const { container } = render(
      <UserProfileCard isLoading onEdit={jest.fn()} />,
    );

    const section = screen.getByRole("region", { name: "Tus datos" });
    expect(section).toHaveAttribute("aria-busy", "true");
    expect(
      screen.getByRole("status", { name: "Cargando tus datos" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the empty state for null data without edit button", () => {
    render(<UserProfileCard onEdit={jest.fn()} />);

    expect(
      screen.getByText("Todavía no hay datos de contacto para mostrar."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("fires onEdit with the full data object when editing", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();

    render(<UserProfileCard data={profile} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: /Editar datos/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(profile);
  });

  it("supports a custom title and merged className", () => {
    const { container } = render(
      <UserProfileCard data={profile} title="Mi perfil" className="max-w-sm" />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Mi perfil" }),
    ).toBeInTheDocument();
    expect(container.querySelector("section")).toHaveClass("max-w-sm");
  });
});

describe("supabaseProfileToUserData", () => {
  it("maps a full row keeping snake_case keys", () => {
    const row: SupabaseProfileRow = {
      id: "u1",
      full_name: "Iraima Hurtado",
      phone_number: "+54 11 4824 0900",
      email: "iraima@hallo.com.ar",
      avatar_url: "https://example.com/avatar.jpg",
    };

    expect(supabaseProfileToUserData(row)).toEqual({
      id: "u1",
      name: "Iraima Hurtado",
      phone: "+54 11 4824 0900",
      email: "iraima@hallo.com.ar",
      avatarUrl: "https://example.com/avatar.jpg",
    });
  });

  it("maps null columns to empty strings", () => {
    const row: SupabaseProfileRow = {
      id: "u2",
      full_name: null,
      phone_number: null,
      email: null,
      avatar_url: null,
    };

    expect(supabaseProfileToUserData(row)).toEqual({
      id: "u2",
      name: "",
      phone: "",
      email: "",
      avatarUrl: "",
    });
  });
});

describe("magentoCustomerToUserData", () => {
  it("joins firstname and lastname and reads custom attributes", () => {
    const customer: MagentoCustomer = {
      id: 2048,
      firstname: "Lucas",
      lastname: "Fernández",
      email: "lucas@hallo.com.ar",
      custom_attributes: [
        { code: "telephone", value: "+54 11 4300 1122" },
        { code: "avatar_url", value: "https://example.com/lucas.jpg" },
      ],
    };

    expect(magentoCustomerToUserData(customer)).toEqual({
      id: "2048",
      name: "Lucas Fernández",
      phone: "+54 11 4300 1122",
      email: "lucas@hallo.com.ar",
      avatarUrl: "https://example.com/lucas.jpg",
    });
  });

  it("keeps the single present name part", () => {
    const customer: MagentoCustomer = {
      id: "31",
      firstname: null,
      lastname: "Rossi",
      email: "rossi@hallo.com.ar",
    };

    expect(magentoCustomerToUserData(customer).name).toBe("Rossi");
  });

  it("handles null values and missing attributes", () => {
    const customer: MagentoCustomer = {
      id: "32",
      firstname: null,
      lastname: null,
      email: null,
      custom_attributes: [{ code: "telephone", value: null }],
    };

    expect(magentoCustomerToUserData(customer)).toEqual({
      id: "32",
      name: "",
      phone: "",
      email: "",
      avatarUrl: "",
    });
  });
});
