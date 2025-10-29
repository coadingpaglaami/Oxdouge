// "use client";

// import { useState } from "react";
// import { Breadcrumb } from "@/appcomponent/reusable";
// import { User, Edit, Eye, EyeClosed, LockIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export const Settings = () => {
//   const [editProfile, setEditProfile] = useState(false);
//   const [showCurrentPwd, setShowCurrentPwd] = useState(false);
//   const [showNewPwd, setShowNewPwd] = useState(false);
//   const [showConfirmPwd, setShowConfirmPwd] = useState(false);

//   const [profile, setProfile] = useState({
//     name: "Admin User",
//     email: "admin@example.com",
//   });

//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: "",
//   });

//   return (
//     <>
//       <Breadcrumb title="Settings" subtitle="Configure Your Admin Preference" />

//       <div className="flex flex-col gap-8 mt-6">
//         {/* 1st Child: Admin Profile */}
//         <div className="flex flex-col gap-6 border border-primary/20 rounded-md p-6 bg-[#121212] text-white">
//           {/* Header */}
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <User className="w-6 h-6 text-primary" />
//               <div className="flex flex-col">
//                 <p className="font-semibold">Profile Setting</p>
//                 <p className="text-sm text-gray-400">Update Your Admin Profile Information</p>
//               </div>
//             </div>
//             <Edit
//               className="w-5 h-5 text-primary cursor-pointer"
//               onClick={() => setEditProfile(!editProfile)}
//             />
//           </div>

//           {/* Profile Form */}
//           <form className="flex flex-col gap-4">
//             <div className="flex flex-col gap-1 w-full">
//               <label className="text-sm text-gray-400">Admin Name</label>
//               <Input
//                 value={profile.name}
//                 onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//                 disabled={!editProfile}
//                 className="bg-[#1E1E1E] text-white border border-primary"
//               />
//             </div>

//             <div className="flex flex-col gap-1 w-full">
//               <label className="text-sm text-gray-400">Admin Email</label>
//               <Input
//                 value={profile.email}
//                 disabled
//                 className="bg-[#1E1E1E] text-white border border-primary"
//               />
//             </div>

//             {editProfile && (
//               <Button type="submit" className="md:w-1/3 self-start bg-primary hover:bg-primary/90 mt-2">
//                 Update Profile
//               </Button>
//             )}
//           </form>
//         </div>

//         {/* 2nd Child: Change Password */}
//         <div className="flex flex-col gap-6 border border-primary/20 rounded-md p-6 bg-[#121212] text-white">
//           {/* Header */}
//           <div className="flex items-center gap-3">
//             <LockIcon className="w-6 h-6 text-primary" />
//             <div className="flex flex-col">
//               <p className="font-semibold">Change Password</p>
//               <p className="text-sm text-gray-400">Update your account password</p>
//             </div>
//           </div>

//           {/* Password Form */}
//           <form className="flex flex-col gap-4">
//             {/* Current Password */}
//             <div className="flex flex-col gap-1 w-full relative">
//               <label className="text-sm text-gray-400">Current Password</label>
//               <Input
//                 type={showCurrentPwd ? "text" : "password"}
//                 value={passwords.current}
//                 onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                 className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
//               />
//               <span
//                 className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
//                 onClick={() => setShowCurrentPwd(!showCurrentPwd)}
//               >
//                 {showCurrentPwd ? <EyeClosed className="text-primary"/> : <Eye className="text-primary" size={16}/>}
//               </span>
//             </div>

//             {/* New Password */}
//             <div className="flex flex-col gap-1 w-full relative">
//               <label className="text-sm text-gray-400">New Password</label>
//               <Input
//                 type={showNewPwd ? "text" : "password"}
//                 value={passwords.new}
//                 onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                 className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
//               />
//               <span
//                 className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
//                 onClick={() => setShowNewPwd(!showNewPwd)}
//               >
//                 {showNewPwd ?<EyeClosed className="text-primary" size={16}/> : <Eye className="text-primary" size={16}/>}
//               </span>
//             </div>

//             {/* Confirm New Password */}
//             <div className="flex flex-col gap-1 w-full relative">
//               <label className="text-sm text-gray-400">Confirm New Password</label>
//               <Input
//                 type={showConfirmPwd ? "text" : "password"}
//                 value={passwords.confirm}
//                 onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
//                 className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
//               />
//               <span
//                 className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
//                 onClick={() => setShowConfirmPwd(!showConfirmPwd)}
//               >
//                 {showConfirmPwd ? <EyeClosed className="text-primary" size={16}/> : <Eye className="text-primary" size={16}/>}
//               </span>
//             </div>

//             <Button type="submit" className="md:w-1/3 self-start bg-primary hover:bg-primary/90 mt-2">
//               Change Password
//             </Button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/appcomponent/reusable";
import { User, Edit, Eye, EyeClosed, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useEmailSecurityQuery,
  useUpdateEmailSecurityMutation,
  useChangePasswordUserMutation,
} from "@/api/authApi";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  primary_email: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export const Settings = () => {
  const [editProfile, setEditProfile] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    primary_email: "",
  });

  const [passwords, setPasswords] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  // API Hooks
  const { data: emailSecurityData, isLoading: isLoadingProfile } =
    useEmailSecurityQuery(undefined);
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateEmailSecurityMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordUserMutation();

  // Load profile data when component mounts or data changes
  useEffect(() => {
    if (emailSecurityData) {
      setProfile({
        name: emailSecurityData.name || "",
        primary_email: emailSecurityData.primary_email || "",
      });
    }
  }, [emailSecurityData]);

  const handleProfileSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      await updateProfile({
        name: profile.name,
        primary_email: profile.primary_email,
      }).unwrap();

      toast.success("Profile updated successfully");
      setEditProfile(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handlePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation
    if (
      !passwords.current_password ||
      !passwords.new_password ||
      !passwords.confirm_new_password
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (passwords.new_password !== passwords.confirm_new_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    try {
      await changePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
        confirm_new_password: passwords.confirm_new_password,
      }).unwrap();

      toast.success("Password changed successfully");

      // Reset password fields
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });

      // Hide password visibility
      setShowCurrentPwd(false);
      setShowNewPwd(false);
      setShowConfirmPwd(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        "Failed to change password";
      toast.error(errorMessage);
    }
  };

  if (isLoadingProfile) {
    return (
      <>
        <Breadcrumb
          title="Settings"
          subtitle="Configure Your Admin Preference"
        />
        <div className="flex justify-center items-center h-64 text-white">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Settings" subtitle="Configure Your Admin Preference" />

      <div className="flex flex-col gap-8 mt-6">
        {/* 1st Child: Admin Profile */}
        <div className="flex flex-col gap-6 border border-primary/20 rounded-md p-6 bg-[#121212] text-white">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              <div className="flex flex-col">
                <p className="font-semibold">Profile Setting</p>
                <p className="text-sm text-gray-400">
                  Update Your Admin Profile Information
                </p>
              </div>
            </div>
            <Edit
              className="w-5 h-5 text-primary cursor-pointer"
              onClick={() => setEditProfile(!editProfile)}
            />
          </div>

          {/* Profile Form */}
          <form className="flex flex-col gap-4" onSubmit={handleProfileSubmit}>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-gray-400">Admin Name</label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!editProfile || isUpdatingProfile}
                className="bg-[#1E1E1E] text-white border border-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-gray-400">Admin Email</label>
              <Input
                value={profile.primary_email}
                disabled
                className="bg-[#1E1E1E] text-white border border-primary"
              />
            </div>

            {editProfile && (
              <Button
                type="submit"
                className="md:w-1/3 self-start bg-primary hover:bg-primary/90 mt-2"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </Button>
            )}
          </form>
        </div>

        {/* 2nd Child: Change Password */}
        <div className="flex flex-col gap-6 border border-primary/20 rounded-md p-6 bg-[#121212] text-white">
          {/* Header */}
          <div className="flex items-center gap-3">
            <LockIcon className="w-6 h-6 text-primary" />
            <div className="flex flex-col">
              <p className="font-semibold">Change Password</p>
              <p className="text-sm text-gray-400">
                Update your account password
              </p>
            </div>
          </div>

          {/* Password Form */}
          <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
            {/* Current Password */}
            <div className="flex flex-col gap-1 w-full relative">
              <label className="text-sm text-gray-400">Current Password</label>
              <Input
                type={showCurrentPwd ? "text" : "password"}
                value={passwords.current_password}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    current_password: e.target.value,
                  })
                }
                className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
                disabled={isChangingPassword}
                required
              />
              <span
                className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
                onClick={() => setShowCurrentPwd(!showCurrentPwd)}
              >
                {showCurrentPwd ? (
                  <EyeClosed className="text-primary" size={16} />
                ) : (
                  <Eye className="text-primary" size={16} />
                )}
              </span>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1 w-full relative">
              <label className="text-sm text-gray-400">New Password</label>
              <Input
                type={showNewPwd ? "text" : "password"}
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
                className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
                disabled={isChangingPassword}
                required
              />
              <span
                className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
                onClick={() => setShowNewPwd(!showNewPwd)}
              >
                {showNewPwd ? (
                  <EyeClosed className="text-primary" size={16} />
                ) : (
                  <Eye className="text-primary" size={16} />
                )}
              </span>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1 w-full relative">
              <label className="text-sm text-gray-400">
                Confirm New Password
              </label>
              <Input
                type={showConfirmPwd ? "text" : "password"}
                value={passwords.confirm_new_password}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm_new_password: e.target.value,
                  })
                }
                className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
                disabled={isChangingPassword}
                required
              />
              <span
                className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                {showConfirmPwd ? (
                  <EyeClosed className="text-primary" size={16} />
                ) : (
                  <Eye className="text-primary" size={16} />
                )}
              </span>
            </div>

            <Button
              type="submit"
              className="md:w-1/3 self-start bg-primary hover:bg-primary/90 mt-2"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
