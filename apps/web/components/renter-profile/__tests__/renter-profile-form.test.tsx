import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RenterProfileForm } from "@/components/renter-profile/RenterProfileForm";

describe("RenterProfileForm", () => {
  it("renders the four sections with the readOnly email pre-filled", () => {
    render(<RenterProfileForm />);

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Household Details")).toBeInTheDocument();
    expect(screen.getByText("Pets & Financials")).toBeInTheDocument();
    expect(screen.getByText("Lease Preferences")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("lapentav11@gmail.com");
    expect(screen.getByLabelText("Email")).toHaveAttribute("readonly");
  });

  it("shows errors for missing required fields on Save", async () => {
    const user = userEvent.setup();

    render(<RenterProfileForm />);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Enter your first name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your last name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your phone number.")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("saves a valid profile and shows the summary status", async () => {
    const user = userEvent.setup();

    render(<RenterProfileForm />);
    await user.type(screen.getByLabelText(/First name/), "Iraima");
    await user.type(screen.getByLabelText(/Last name/), "Hurtado");
    await user.type(screen.getByLabelText(/Phone number/), "+54 11 5555 0101");

    const householdGroup = screen.getByRole("radiogroup", {
      name: "Total people in household",
    });
    await user.click(within(householdGroup).getByRole("radio", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Profile saved: Iraima Hurtado");
    expect(status).toHaveTextContent("Household of 3");
  });

  it("Cancel resets the form and clears the saved summary", async () => {
    const user = userEvent.setup();

    render(<RenterProfileForm />);
    await user.type(screen.getByLabelText(/First name/), "Iraima");
    await user.type(screen.getByLabelText(/Last name/), "Hurtado");
    await user.type(screen.getByLabelText(/Phone number/), "+54 11 5555 0101");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("status")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/First name/)).toHaveValue("");
  });
});
