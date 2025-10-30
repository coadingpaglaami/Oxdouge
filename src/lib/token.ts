// src/lib/token.ts
import Cookies from "js-cookie";

export const setAuthTokens = (
  access: string,
  refresh: string,
  role: string
) => {
  Cookies.set("access", access, {
    expires: 30,
    secure: true, // must be true when sameSite: 'none'
    sameSite: "none",
    path: "/",
  });

  Cookies.set("refresh", refresh, {
    expires: 30,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  Cookies.set("role", role, {
    expires: 30,
    secure: true,
    sameSite: "none",
    path: "/",
  });
};

export const removeAuthTokens = () => {
  Cookies.remove("access", { path: "/" });
  Cookies.remove("refresh", { path: "/" });
  Cookies.remove("role", { path: "/" });
};
