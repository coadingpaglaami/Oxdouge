import { ShippingAddress } from "@/interfaces/ShippingAddress";

export const shippingAddresses: ShippingAddress[] = [
  {
    id: 1,
    label: "Home — John Miller",
    street: "1234 Oakridge Avenue",
    addressLine2: "Apt 5B",
    city: "Brooklyn",
    state: "NY",
    zip: "11226",
    country: "United States",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office — John Miller",
    street: "77 Corporate Blvd",
    addressLine2: "Suite 9",
    city: "Manhattan",
    state: "NY",
    zip: "10036",
    country: "United States",
  },
];