'use client';
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ForgetPassword = () => {
  const [step, setStep] = useState<'forget-password'| 'verifyOtp' | 'reset-password'>("forget-password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        {step === "forget-password" && "Enter your details to receive OTP"}
        {step === "verifyOtp" && "Enter your details to receive OTP"}
        {step === "reset-password" && ""}
      </p>

      {/* Main Form Section */}
      <div className="bg-[#121212] flex flex-col gap-4 border border-primary/20 rounded-lg p-6 w-full max-w-md">
        
        {step === "forget-password" && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm">Email</label>
              <input type="email" className="p-2 rounded border border-primary/20  text-white outline-none bg-[#1E1E1E]"/>
            </div>
            <Button className="self-center mt-4" onClick={() => setStep("verifyOtp")}>Send OTP</Button>
          </>
        )}

        {step === "verifyOtp" && (
          <>
            <div className="flex flex-col gap-1 relative">
              <label className="text-sm">Enter Your OTP</label>
              <input type="text" className="p-2 rounded border border-primary/20 bg-[#1E1E1E] text-white outline-none"/>
              <button className="absolute right-2 bottom-2 text-primary text-sm">Resend OTP</button>
            </div>
            <Button className="self-center mt-4" onClick={() => setStep("reset-password")}>Verify OTP</Button>
          </>
        )}

        {step === "reset-password" && (
          <>
            <div className="flex flex-col gap-1 relative">
              <label className="text-sm">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="p-2 rounded border border-primary/20 bg-[#1E1E1E] text-white w-full outline-none"
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 relative">
              <label className="text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="p-2 rounded border border-primary/20 bg-[#1E1E1E] text-white w-full outline-none"
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </span>
              </div>
            </div>
            <Button className="self-center mt-4">Submit</Button>
          </>
        )}

      </div>
    </div>
  );
};
