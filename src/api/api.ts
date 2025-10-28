// src/app/services/baseApi.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/lib/config";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    // ❌ Never set "Content-Type" manually for FormData
    // if( endpoint === 'login'){
    //     headers.set("Content-Type", "application/json");
    // } else{
    //     headers.delete("Content-Type");
    // }
    headers.delete("Content-Type");

    // ✅ Get access token from cookies
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access"))
        ?.split("=")[1];
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
  validateStatus: (response) => response.status >= 200 && response.status < 400,
});

export default rawBaseQuery;