// Single contact/message item
export interface ContactItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "REPLIED" | "READ"; // Only uppercase values allowed
  created_at: string; // ISO string
}

// API response structure
export interface ContactListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContactItem[];
}