import { User } from "./CreateUserResponse";

export interface LoginResponse {
  message: string;
  token: Token;
  user: User; // Reusing the previously defined User interface
  clear_session: boolean; // New field to indicate if session should be cleared
}

export interface Token {
  refresh: string;
  access: string;
}

export interface GoogleLoginResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  refresh: string;
  access: string;
}