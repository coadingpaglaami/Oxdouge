export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: "buyer" | "seller" | "admin"; // assuming future roles
}
