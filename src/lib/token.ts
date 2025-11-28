import Cookies from "js-cookie";

export const setAuthTokens = (
  access: string,
  refresh: string,
  role: string,
  email?: string
) => {
  Cookies.set("access", access, {
    expires: 30,
    secure: true, // must be true when sameSite: 'none'
    sameSite: "Lax",
    path: "/",
  });

  Cookies.set("refresh", refresh, {

    expires: 30,
    secure: true,
    sameSite: "Lax",
    path: "/",
  });

  Cookies.set("role", role, {
    expires: 30,
    secure: true,
    sameSite: "Lax",
    path: "/",
  });
  if (email) {
    Cookies.set("email", email, {
      expires: 30,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });
  }
};

export const removeAuthTokens = () => {
  Cookies.remove("access", { path: "/" });
  Cookies.remove("refresh", { path: "/" });
  Cookies.remove("role", { path: "/" });
};

// ✅ New helper: get tokens
export const getAuthTokens = () => {
  const access = Cookies.get("access") || null;
  const refresh = Cookies.get("refresh") || null;
  const role = Cookies.get("role") || null;
  const email = Cookies.get("email") || null;

  return { access, refresh, role, email };
};

// ✅ Optional: get only access token
export const getAccessToken = () => Cookies.get("access") || null;

// ✅ Optional: get only refresh token
export const getRefreshToken = () => Cookies.get("refresh") || null;

// ✅ Optional: get user role
export const getUserRole = () => Cookies.get("role") || null;
