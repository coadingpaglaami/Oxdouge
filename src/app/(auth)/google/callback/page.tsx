// app/google/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthTokens } from "@/lib/token";
import { useGoogleExchangeMutation } from "@/api/authApi";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [googleExchange, { isLoading, error }] = useGoogleExchangeMutation();
  const [status, setStatus] = useState<string>("Processing Google login...");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      
      if (!code) {
        setStatus("No authorization code received. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        setStatus("Processing google login...");
        
        // Call the exchange endpoint with the code
        const response = await googleExchange({ code }).unwrap();
        
        console.log("Google login successful", response);
        
        // Set the authentication tokens
        setAuthTokens(response.access, response.refresh, response.user.role);
        
        setStatus("Processing successful! Redirecting...");
        
        // Redirect to home page or dashboard
        setTimeout(() => router.push("/"), 1000);
        
      } catch (err) {
        console.error("Google failed", err);
        setStatus("Process failed. Redirecting to login page...");
        
        // Redirect to login page with error after delay
        setTimeout(() => router.push("/login?error=google_login_failed"), 2000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, googleExchange, router]);

  return (
    <div className="fixed h-screen w-screen top-0 left-0 z-[9999]">
    <div className="flex justify-center items-center min-h-screen bg-[#121212]">
      <div className="text-white text-center">
        <h2 className="text-2xl mb-4">{status}</h2>
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <p className="text-red-500 mt-2">
            Authentication failed. Please try again.
          </p>
        )}
      </div>
    </div>
    </div>
  );
}