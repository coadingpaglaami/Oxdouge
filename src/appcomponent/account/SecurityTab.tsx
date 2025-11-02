
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChangePasswordUserMutation } from "@/api/authApi";
import { toast } from "sonner";

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

interface PasswordErrors {
  current_password?: string;
  new_password?: string;
  confirm_new_password?: string;
}

export const SecurityTab = () => {
  const [formData, setFormData] = useState<PasswordFormData>({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [errors, setErrors] = useState<PasswordErrors>({});
  const [changePassword, { isLoading }] = useChangePasswordUserMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Strong password validation
  const validatePassword = (password: string): string | null => {
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password))
      return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Password must include at least one lowercase letter.";
    if (!/[0-9]/.test(password))
      return "Password must include at least one number.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      return "Password must include at least one special character.";
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: PasswordErrors = {};

    if (!formData.current_password) {
      newErrors.current_password = "Current password is required.";
    }

    const newPassError = validatePassword(formData.new_password);
    if (newPassError) {
      newErrors.new_password = newPassError;
    }

    if (formData.new_password !== formData.confirm_new_password) {
      newErrors.confirm_new_password = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = (): void => {
    setFormData({
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });
    setErrors({});
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await changePassword(formData).unwrap();
      toast.success("Password updated successfully");
      resetForm();
    } catch (error: unknown) {
      console.error("Failed to update password", error);

      const err = error as {
        data?: { detail?: string; message?: string };
        message?: string;
      };

      const message =
        err?.data?.detail ||
        err?.data?.message ||
        err?.message ||
        "Password change failed";

      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 border border-primary rounded-lg">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">Update Password</h2>
        <p className="text-sm text-gray-400">
          Update your password to keep your account secure.
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Current Password</label>
          <Input
            type="password"
            name="current_password"
            placeholder="Current Password"
            className="w-full border border-primary/20"
            value={formData.current_password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.current_password && (
            <p className="text-xs text-red-500">{errors.current_password}</p>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">New Password</label>
          <Input
            type="password"
            name="new_password"
            placeholder="New Password"
            className="w-full border border-primary/20"
            value={formData.new_password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.new_password && (
            <p className="text-xs text-red-500">{errors.new_password}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Confirm New Password</label>
          <Input
            type="password"
            name="confirm_new_password"
            placeholder="Confirm New Password"
            className="w-full border border-primary/20"
            value={formData.confirm_new_password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.confirm_new_password && (
            <p className="text-xs text-red-500">
              {errors.confirm_new_password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          className="mt-2 w-fit bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
};
