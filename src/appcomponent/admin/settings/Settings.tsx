"use client";

import { useState } from "react";
import { Breadcrumb } from "@/appcomponent/reusable";
import { User, Edit, Eye, EyeClosed, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Settings = () => {
  const [editProfile, setEditProfile] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

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
                <p className="text-sm text-gray-400">Update Your Admin Profile Information</p>
              </div>
            </div>
            <Edit
              className="w-5 h-5 text-primary cursor-pointer"
              onClick={() => setEditProfile(!editProfile)}
            />
          </div>

          {/* Profile Form */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-gray-400">Admin Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!editProfile}
                className="bg-[#1E1E1E] text-white border border-primary"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-gray-400">Admin Email</label>
              <Input
                value={profile.email}
                disabled
                className="bg-[#1E1E1E] text-white border border-primary"
              />
            </div>

            {editProfile && (
              <Button type="submit" className="md:w-1/3 self-start bg-primary hover:bg-primary/90 mt-2">
                Update Profile
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
              <p className="text-sm text-gray-400">Update your account password</p>
            </div>
          </div>

          {/* Password Form */}
          <form className="flex flex-col gap-4">
            {/* Current Password */}
            <div className="flex flex-col gap-1 w-full relative">
              <label className="text-sm text-gray-400">Current Password</label>
              <Input
                type={showCurrentPwd ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
              />
              <span
                className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
                onClick={() => setShowCurrentPwd(!showCurrentPwd)}
              >
                {showCurrentPwd ? <EyeClosed className="text-primary"/> : <Eye className="text-primary" size={16}/>}
              </span>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1 w-full relative">
              <label className="text-sm text-gray-400">New Password</label>
              <Input
                type={showNewPwd ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
              />
              <span
                className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
                onClick={() => setShowNewPwd(!showNewPwd)}
              >
                {showNewPwd ?<EyeClosed className="text-primary" size={16}/> : <Eye className="text-primary" size={16}/>}
              </span>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1 w-full relative">
              <label className="text-sm text-gray-400">Confirm New Password</label>
              <Input
                type={showConfirmPwd ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="bg-[#1E1E1E] text-white border border-primary/20 pr-10"
              />
              <span
                className="absolute right-3 top-[55%] cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                {showConfirmPwd ? <EyeClosed className="text-primary" size={16}/> : <Eye className="text-primary" size={16}/>}
              </span>
            </div>

            <Button type="submit" className="md:w-1/3 self-start bg-primary hover:bg-primary/90 mt-2">
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
