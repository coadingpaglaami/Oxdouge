"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useResetOtpMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/api/authApi";
import { useRouter } from "next/navigation";

export const ForgetPassword = () => {
  const [step, setStep] = useState<
    "forget-password" | "verifyOtp" | "reset-password"
  >("forget-password");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetOtp, { isLoading: isResetting }] = useResetOtpMutation();
  const router = useRouter();

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  // -----------------------------
  // Button Handlers
  // -----------------------------
  const handleSendOtp = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email address";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      await sendOtp(formData).unwrap();
      setStep("verifyOtp");
      setErrors({});
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!otp) newErrors.otp = "OTP is required";
    else if (!/^\d{6}$/.test(otp)) newErrors.otp = "OTP must be 6 digits";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", otp);
      await verifyOtp(formData).unwrap();
      setStep("reset-password");
      setErrors({});
    } catch {
      toast.error("OTP verification failed. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!newPassword) newErrors.newPassword = "Password is required";
    else if (!passwordRegex.test(newPassword))
      newErrors.newPassword =
        "Password must be 8+ chars, include letters, numbers & special char";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (confirmPassword !== newPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);
      formData.append("new_password", newPassword);
      formData.append("confirm_password", confirmPassword);
      await resetOtp(formData).unwrap();

      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch {
      toast.error("Password reset failed. Please try again.");
    }
  };

  // -----------------------------
  // Key Press Handler (Enter Key)
  // -----------------------------
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === "forget-password") handleSendOtp();
      if (step === "verifyOtp") handleVerifyOtp();
      if (step === "reset-password") handleResetPassword();
    }
  };

  // -----------------------------
  // Render UI
  // -----------------------------
  return (
    <div className="flex flex-col justify-start items-center min-h-[91vh] gap-6 bg-[#121212] text-white px-4 py-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-primary">
        {step === "forget-password" && "Forget Password"}
        {step === "verifyOtp" && "Enter OTP"}
        {step === "reset-password" && "Set New Password"}
      </h2>

      <p className="text-gray-400 text-center">
        {step === "forget-password" && "Enter your email to receive OTP"}
        {step === "verifyOtp" && "Enter the OTP sent to your email"}
        {step === "reset-password" && "Enter your new password"}
      </p>

      <div className="bg-[#121212] flex flex-col gap-4 border border-primary/20 rounded-lg p-6 w-full max-w-md">
        {step === "forget-password" && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`p-2 rounded border ${
                  errors.email ? "border-red-500" : "border-primary/20"
                } text-white outline-none bg-[#1E1E1E]`}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>
            <Button
              className="self-center mt-4 disabled:opacity-50"
              disabled={isLoading}
              onClick={handleSendOtp}
            >
              {isLoading ? "Sending" : "Send OTP"}
            </Button>
          </>
        )}

        {step === "verifyOtp" && (
          <>
            <div className="flex flex-col gap-1 relative">
              <label className="text-sm">Enter Your OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`p-2 rounded border ${
                  errors.otp ? "border-red-500" : "border-primary/20"
                } bg-[#1E1E1E] text-white outline-none`}
              />
              {errors.otp && (
                <span className="text-xs text-red-500">{errors.otp}</span>
              )}
              <button
                type="button"
                className="absolute right-2 bottom-2 text-primary text-sm"
                onClick={() => handleSendOtp()}
              >
                Resend OTP
              </button>
            </div>
            <Button
              className="self-center mt-4 disabled:opacity-50"
              disabled={isVerifying}
              onClick={handleVerifyOtp}
            >
              {isVerifying ? "Verifying" : "Verify OTP"}
            </Button>
          </>
        )}

        {step === "reset-password" && (
          <>
            <div className="flex flex-col gap-1 relative">
              <label className="text-sm">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className={`p-2 rounded border ${
                    errors.newPassword ? "border-red-500" : "border-primary/20"
                  } bg-[#1E1E1E] text-white w-full outline-none`}
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errors.newPassword && (
                <span className="text-xs text-red-500">
                  {errors.newPassword}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 relative">
              <label className="text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className={`p-2 rounded border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-primary/20"
                  } bg-[#1E1E1E] text-white w-full outline-none`}
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-red-500">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <Button
              className="self-center mt-4 disabled:opacity-50"
              disabled={isResetting}
              onClick={handleResetPassword}
            >
              {isResetting ? "Submitting" : "Submit"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
