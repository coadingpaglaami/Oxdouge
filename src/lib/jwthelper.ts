import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
  role: string;
  name: string;
  email: string;
}

export const decodeToken = (token: string | null) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const getUserInfoFromToken = (token: string | null) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
    userId: decoded.user_id,
  };
};
