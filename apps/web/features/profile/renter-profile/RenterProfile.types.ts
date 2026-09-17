export type RenterProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  moveInDate: string | null;
  householdSize: string | null;
  householdIncome: string;
  hasHousingVoucher: boolean;
  hasPets: string | null;
  creditScoreRange: string | null;
  noCreditScore: boolean;
  leaseDuration: string | null;
  bedroomCount: string | null;
  parkingNeeded: string | null;
};

export const INITIAL_RENTER_PROFILE: RenterProfileFormData = {
  firstName: "",
  lastName: "",
  email: "lapentav11@gmail.com",
  phone: "",
  moveInDate: null,
  householdSize: null,
  householdIncome: "",
  hasHousingVoucher: false,
  hasPets: null,
  creditScoreRange: null,
  noCreditScore: false,
  leaseDuration: null,
  bedroomCount: null,
  parkingNeeded: null,
};

export type RenterProfileFormErrors = Partial<
  Pick<RenterProfileFormData, "firstName" | "lastName" | "phone">
>;
