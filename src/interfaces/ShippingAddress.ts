export interface ShippingAddress {
  id: number;
  label: string;            // Example: "Home — John Miller"
  street: string;           // Example: "1234 Oakridge Avenue"
  addressLine2?: string;    // Example: "Apt 5B"
  city: string;             // Example: "Brooklyn"
  state: string;            // Example: "NY"
  zip: string;              // Example: "11226"
  country: string;          // Example: "United States"
  isDefault?: boolean;
}
 