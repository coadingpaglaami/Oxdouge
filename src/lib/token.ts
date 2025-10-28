// src/lib/token.ts
import Cookies from "js-cookie";

export const setAuthTokens = (access: string, refresh: string) => {
  // Access token cookie
  Cookies.set("access", access, {
    expires: 30, // days
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  // Refresh token cookie
  Cookies.set("refresh", refresh, {
    expires: 30, // days
    secure: true,
    sameSite: "strict",
    path: "/",
  });
};

export const removeAuthTokens = () => {
  Cookies.remove("access", { path: "/" });
  Cookies.remove("refresh", { path: "/" });
};
