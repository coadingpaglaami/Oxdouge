"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLoginMutation, useGoogleLoginQuery, useGoogleExchangeMutation } from "@/api/authApi";
import { setAuthTokens } from "@/lib/token";
import { useRouter, useSearchParams } from "next/navigation";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [login, { isLoading }] = useLoginMutation();
  const { data: googleAuthData, refetch: initiateGoogleLogin } = useGoogleLoginQuery();
  const [googleExchange, { isLoading: isGoogleLoading }] = useGoogleExchangeMutation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams.get("error")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      
      if (code) {
        try {
          const res = await googleExchange({ code }).unwrap();
          console.log("Google login successful", res);
          setAuthTokens(res.access, res.refresh, res.user.role);
          router.push("/");
        } catch (err) {
          console.error("Google login failed", err);
          // Handle error - show error message to user
        }
      }
    };

    handleGoogleCallback();
  }, [searchParams, googleExchange, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8+ chars, include letters, numbers & special char";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      try {
        const res = await login(formData).unwrap();
        console.log("Login successful", res);
        setAuthTokens(res.token.access, res.token.refresh, res.user.role);
        router.push("/");
      } catch (err) {
        console.error("Login failed", err);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Trigger the Google OAuth flow
      const response = await initiateGoogleLogin().unwrap();
      
      if (response?.auth_url) {
        // Redirect to Google OAuth page
        window.location.href = response.auth_url;
      }
    } catch (err) {
      console.error("Failed to initiate Google login", err);
    }
  };

  return (
    <div className=" flex justify-center items-center min-h-[91vh] max-w-[80vw] mx-auto">
      <div className="flex items-stretch md:flex-row-reverse w-full h-full bg-[#121212] rounded-lg overflow-hidden gap-10 p-6">
        {/* LEFT IMAGE */}
        <div className="w-1/2 relative md:hidden" style={{ aspectRatio: "3/3.1" }}>
          <Image
            src="/landing/background1.jpg"
            alt="Signup"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-1/2 flex flex-col justify-center text-white gap-4 ">
          {/* HEADER */}
          <h2 className="text-3xl font-semibold text-primary">Login</h2>
           {error == 'google_login_failed' && (
            <p className="text-red-400 text-center">Google login/signup failed</p>
          )}
         
          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-transparent border rounded p-2 outline-none border-primary/40 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-transparent border border-primary/40 rounded p-2 pr-10 outline-none ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-primary" />
                  ) : (
                    <Eye className="text-primary" />
                  )}
                </span>
              </div>
              <Link href="/forget-password" className="text-primary text-sm">
                Forget Password
              </Link>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
              
            </div>
            

            {/* Submit */}
            <Button
              type="submit"
              className="mt-2 self-center w-fit disabled:cursor-none disabled:opacity-25"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* OR + Google */}
          <div className="flex flex-col items-center gap-3 ">
            <span className="text-gray-400">OR</span>
            <Button 
              variant="outline" 
              className="flex gap-2"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 533.5 544.3"
                width="24"
                height="24"
              >
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h146.9c-6.3 34.1-25 63-53.4 82.2v68.2h86.2c50.4-46.5 81.8-114.9 81.8-195.4z"
                />
                <path
                  fill="#34A853"
                  d="M272 544.3c72.6 0 133.6-24 178.2-65.4l-86.2-68.2c-24.1 16.2-55 25.7-92 25.7-70.7 0-130.5-47.8-152-112.2H30.1v70.5c44.7 88.3 137.2 150 241.9 150z"
                />
                <path
                  fill="#FBBC05"
                  d="M120 321.9c-10.8-32.4-10.8-67.6 0-100l-89.9-70.5c-39.3 77.1-39.3 168.5 0 245.6l89.9-70.5z"
                />
                <path
                  fill="#EA4335"
                  d="M272 107.1c38.9-0.6 76.2 13.9 104.4 40.4l78.1-78.1C406.5 24 344.8-0.3 272 0 167.3 0 74.8 61.7 30.1 150l89.9 70.5c21.5-64.4 81.3-112.2 152-112.2z"
                />
              </svg>
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>
          </div>

          {/* Footer */}
          <div className=" text-sm text-center ">
            <span className="text-gray-400">Don{"'"}t have an Account? </span>
            <Link href="/signup" className="text-primary underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};