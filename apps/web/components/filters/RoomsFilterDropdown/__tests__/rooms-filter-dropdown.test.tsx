import "@testing-library/jest-dom";
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoomsFilterDropdown } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown";
import type { RoomsSelection } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown.types";

function ControlledRooms({
  onChange,
}: Readonly<{ onChange: (selection: RoomsSelection) => void }>) {
  const [selection, setSelection] = useState<RoomsSelection>({
    bedrooms: [],
    bathrooms: [],
  });
  return (
    <RoomsFilterDropdown
      selectedBedrooms={selection.bedrooms}
      selectedBathrooms={selection.bathrooms}
      onChange={(next) => {
        onChange(next);
        setSelection(next);
      }}
      onDone={jest.fn()}
    />
  );
}

function getBedroomGroup(dialog: HTMLElement) {
  return within(dialog).getByRole("group", { name: "Bedrooms" });
}

describe("RoomsFilterDropdown", () => {
  it("selects a numeric prefix when a bedroom is picked", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <RoomsFilterDropdown
        selectedBedrooms={[]}
        selectedBathrooms={[]}
        onChange={onChange}
        onDone={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Rooms/i }));
    const dialog = screen.getByRole("dialog", { name: "Rooms filter" });

    await user.click(
      within(getBedroomGroup(dialog)).getByRole("button", { name: "3" }),
    );
    expect(onChange).toHaveBeenCalledWith({
      bedrooms: ["1", "2", "3"],
      bathrooms: [],
    });
  });

  it("combines Studio with numeric prefixes", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<ControlledRooms onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /^Rooms/i }));
    const dialog = screen.getByRole("dialog", { name: "Rooms filter" });
    const bedroomGroup = getBedroomGroup(dialog);

    await user.click(within(bedroomGroup).getByRole("button", { name: "Studio" }));
    await user.click(within(bedroomGroup).getByRole("button", { name: "2" }));
    expect(onChange).toHaveBeenLastCalledWith({
      bedrooms: ["Studio", "1", "2"],
      bathrooms: [],
    });

    await user.click(within(bedroomGroup).getByRole("button", { name: "3" }));
    expect(onChange).toHaveBeenLastCalledWith({
      bedrooms: ["Studio", "1", "2", "3"],
      bathrooms: [],
    });
  });

  it("trims the prefix when a lower number is clicked and clears with Any", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <RoomsFilterDropdown
        selectedBedrooms={["1", "2", "3", "4"]}
        selectedBathrooms={[]}
        onChange={onChange}
        onDone={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "4 bds" }));
    const dialog = screen.getByRole("dialog", { name: "Rooms filter" });
    const bedroomGroup = getBedroomGroup(dialog);

    expect(
      within(bedroomGroup).getByRole("button", { name: "4" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(bedroomGroup).getByRole("button", { name: "2" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(within(bedroomGroup).getByRole("button", { name: "2" }));
    expect(onChange).toHaveBeenLastCalledWith({
      bedrooms: ["1", "2"],
      bathrooms: [],
    });

    await user.click(within(bedroomGroup).getByRole("button", { name: "Any" }));
    expect(onChange).toHaveBeenLastCalledWith({
      bedrooms: [],
      bathrooms: [],
    });
  });

  it("applies the same prefix rule to bathrooms", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <RoomsFilterDropdown
        selectedBedrooms={[]}
        selectedBathrooms={[]}
        onChange={onChange}
        onDone={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Rooms/i }));
    const dialog = screen.getByRole("dialog", { name: "Rooms filter" });
    const bathroomGroup = within(dialog).getByRole("group", {
      name: "Bathrooms",
    });

    await user.click(within(bathroomGroup).getByRole("button", { name: "3" }));
    expect(onChange).toHaveBeenLastCalledWith({
      bedrooms: [],
      bathrooms: ["1", "2", "3"],
    });
  });

  it("fires onDone and closes on Done", async () => {
    const user = userEvent.setup();
    const onDone = jest.fn();

    render(
      <RoomsFilterDropdown
        selectedBedrooms={[]}
        selectedBathrooms={[]}
        onChange={jest.fn()}
        onDone={onDone}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Rooms/i }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Done" }),
    );

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog", { name: "Rooms filter" })).not.toBeInTheDocument();
  });
});
