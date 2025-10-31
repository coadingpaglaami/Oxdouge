
"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  // Demo: store generated OTP
  const [generatedOtp, setGeneratedOtp] = useState<string>("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Password strength: min 8 chars, letters, numbers, special char
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  const handleSendOtp = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // Demo OTP
    const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(demoOtp);
    console.log("Demo OTP (for testing):", demoOtp);
    toast.success("OTP is "+demoOtp+" (for demo purposes)");
    setStep("verifyOtp");
    setErrors({});
  };

  const handleVerifyOtp = () => {
    const newErrors: { [key: string]: string } = {};
    if (!otp) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be 6 digits";
    } else if (otp !== generatedOtp) {
      newErrors.otp = "OTP is incorrect";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setStep("reset-password");
    setErrors({});
  };

  const handleResetPassword = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must be 8+ chars, include letters, numbers & special char";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    toast.success("Password reset successfully!");
    setStep("forget-password");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setGeneratedOtp("");
    setErrors({});
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-[91vh] gap-6 bg-[#121212] text-white px-4 py-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-primary">
        {step === "forget-password" && "Forget Password"}
        {step === "verifyOtp" && "Enter OTP"}
        {step === "reset-password" && "Set New Password"}
      </h2>

      {/* Paragraph */}
      <p className="text-gray-400 text-center">
        {step === "forget-password" && "Enter your email to receive OTP"}
        {step === "verifyOtp" && "Enter the OTP sent to your email"}
        {step === "reset-password" && "Enter your new password"}
      </p>

      {/* Main Form Section */}
      <div className="bg-[#121212] flex flex-col gap-4 border border-primary/20 rounded-lg p-6 w-full max-w-md">
        {step === "forget-password" && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`p-2 rounded border ${
                  errors.email ? "border-red-500" : "border-primary/20"
                } text-white outline-none bg-[#1E1E1E]`}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>
            <Button className="self-center mt-4" onClick={handleSendOtp}>
              Send OTP
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
                className={`p-2 rounded border ${
                  errors.otp ? "border-red-500" : "border-primary/20"
                } bg-[#1E1E1E] text-white outline-none`}
              />
              {errors.otp && (
                <span className="text-xs text-red-500">{errors.otp}</span>
              )}
              <button
                className="absolute right-2 bottom-2 text-primary text-sm"
                onClick={() => handleSendOtp()}
              >
                Resend OTP
              </button>
            </div>
            <Button className="self-center mt-4" onClick={handleVerifyOtp}>
              Verify OTP
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
            <Button className="self-center mt-4" onClick={handleResetPassword}>
              Submit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
