export interface CardRequest {
  description: string;
  card_heading: string;
  card_description: string;
  icon: File | null;
}

export interface CardResponse {
  id: number;
  description: string;
  card_heading: string;
  card_description: string;
  icon_url?: string; // The URL where the icon is stored
  icon?: string | null; // The original icon field from the API, which may be null
  created_at?: string;
}
