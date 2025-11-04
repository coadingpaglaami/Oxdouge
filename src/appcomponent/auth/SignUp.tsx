"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useGoogleExchangeMutation,
  useGoogleLoginQuery,
  useSignupMutation,
} from "@/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [googleExchange, { isLoading: isGoogleLoading }] =
    useGoogleExchangeMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    cPassword?: string;
  }>({});
  const formData = new FormData();
  const { data: googleAuthData, refetch: initiateGoogleLogin } =
    useGoogleLoginQuery(undefined, {
      skip: true, // Don't run on mount
    });
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();
  const nameRegex = /^[A-Za-z\s]{1,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      cPassword?: string;
    } = {};

    // Name validation
    if (!name) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name must be letters and spaces only (max 50 chars)";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8+ chars, include letters, numbers & special char";
    }

    // Confirm password validation
    if (!cPassword) {
      newErrors.cPassword = "Confirm Password is required";
    } else if (password !== cPassword) {
      newErrors.cPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirm_password", cPassword);
      try {
        const res = await signup(formData).unwrap();
        console.log("User created:", res);
        toast.success("Account created successfully!", { richColors: true });
        router.push("/login");
      } catch (err) {
        interface ApiError {
          status: number;
          data: {
            [key: string]: string[]; // for example: { email: ["Enter a valid email address."] }
          };
        }

        const error = err as ApiError;

        // Extract the first field and message, if any
        const field = Object.keys(error.data || {})[0];
        const message = field ? error.data[field][0] : "Something went wrong";

        console.error("Failed to create user:", error);
        console.log("Signup 89", error);

        toast.error(message, {
          richColors: true,
        });
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
    <div className="flex justify-center items-center min-h-[91vh] max-w-[80vw] mx-auto">
      <div className="flex items-stretch w-full h-full bg-[#121212] rounded-lg overflow-hidden gap-10 p-6">
        {/* LEFT IMAGE */}
        <div
          className="w-1/2 relative max-md:hidden"
          style={{ aspectRatio: "3/3.1" }}
        >
          <Image
            src="/auth/signup.png"
            alt="Signup"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:w-1/2 w-full flex flex-col justify-center text-white gap-4">
          {/* HEADER */}
          <h2 className="text-3xl font-semibold text-primary">
            Create Account
          </h2>

          {/* FORM */}
          <form className="flex flex-col gap-4 w-4/5" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`bg-transparent border rounded p-2 outline-none border-primary/40 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <span className="text-xs text-red-500">{errors.name}</span>
              )}
            </div>

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
                  className={`w-full bg-transparent border rounded p-2 pr-10 outline-none border-primary/40 ${
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
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showCPassword ? "text" : "password"}
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  className={`w-full bg-transparent border rounded p-2 pr-10 outline-none border-primary/40 ${
                    errors.cPassword ? "border-red-500" : ""
                  }`}
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={() => setShowCPassword(!showCPassword)}
                >
                  {showCPassword ? (
                    <EyeOff className="text-primary" />
                  ) : (
                    <Eye className="text-primary" />
                  )}
                </span>
              </div>
              {errors.cPassword && (
                <span className="text-xs text-red-500">{errors.cPassword}</span>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="mt-2 self-center w-fit disabled:opacity-50 disabled:cursor-none"
              disabled={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* OR + Google */}
          <div className="flex flex-col items-center gap-3 w-4/5">
            <span className="text-gray-400">OR</span>
            <Button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              variant="outline"
              className="flex gap-2"
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
              Continue with Google
            </Button>
          </div>

          {/* Footer */}
          <div className="w-4/5 text-sm text-center ">
            <span className="text-gray-400">Already Have Account? </span>
            <Link href="/login" className="text-primary underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
