// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export const SecurityTab = () => {
//   return (
//     <div className="flex flex-col gap-6 p-6 border border-primary rounded-lg">
//       {/* Header Section */}
//       <div className="flex flex-col gap-2">
//         <h2 className="text-xl font-semibold text-white">Update Password</h2>
//         <p className="text-sm text-gray-400">
//           Update your password to keep your account secure.
//         </p>
//       </div>

//       {/* Form Section */}
//       <form className="flex flex-col gap-4 w-full ">
//         <label className="text-sm text-gray-300">Current Password</label>
//         <Input
//           type="password"
//           placeholder="Current Password"
//           className="w-full border border-primary/20"
//         />
//         <label className="text-sm text-gray-300">New Password</label>
//         <Input
//           type="password"
//           placeholder="New Password"
//           className="w-full border-primary/20"
//         />
//         <label className="text-sm text-gray-300">Confirm New Password</label>
//         <Input
//           type="password"
//           placeholder="Confirm New Password"
//           className="w-full border border-primary/20"
//         />

//         <Button
//           variant="default"
//           className="mt-2 w-fit  bg-primary hover:bg-primary/90"
//         >
//           Update Password
//         </Button>
//       </form>
//     </div>
//   );
// };

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

export const SecurityTab = () => {
  const [formData, setFormData] = useState<PasswordFormData>({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [changePassword, { isLoading }] = useChangePasswordUserMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = (): void => {
    setFormData({
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation
    if (
      !formData.current_password ||
      !formData.new_password ||
      !formData.confirm_new_password
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.new_password !== formData.confirm_new_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    try {
      await changePassword(formData).unwrap();
      toast.success("Password updated successfully");
      resetForm();
    } catch (error: unknown) {
      console.error("Failed To Update Password", error);

      // Type-safe access
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
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">Update Password</h2>
        <p className="text-sm text-gray-400">
          Update your password to keep your account secure.
        </p>
      </div>

      {/* Form Section */}
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
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
        <label className="text-sm text-gray-300">New Password</label>
        <Input
          type="password"
          name="new_password"
          placeholder="New Password"
          className="w-full border-primary/20"
          value={formData.new_password}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />
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
