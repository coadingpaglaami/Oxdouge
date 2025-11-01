"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/api/profileApi";
import { toast } from "sonner";
import Image from "next/image";

export const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    gender: "",
    date_of_birth: "",
    country: "",
  });

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        gender: profile.gender || "",
        date_of_birth: profile.date_of_birth || "",
        country: profile.country || "",
      });
      setProfileImage(profile.profile_image_url || null);
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImageFile(file);

      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append all form fields
      if (formData.full_name)
        formDataToSend.append("full_name", formData.full_name);
      if (formData.phone_number)
        formDataToSend.append("phone_number", formData.phone_number);
      if (formData.address) formDataToSend.append("address", formData.address);
      if (formData.gender) formDataToSend.append("gender", formData.gender);
      if (formData.date_of_birth)
        formDataToSend.append("date_of_birth", formData.date_of_birth);
      if (formData.country) formDataToSend.append("country", formData.country);

      // Append profile image if selected
      if (selectedImageFile) {
        formDataToSend.append("profile_image", selectedImageFile);
      }

      // Send the FormData
      await updateProfile(formDataToSend).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setSelectedImageFile(null); // Reset selected file after successful update
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original profile data
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        gender: profile.gender || "",
        date_of_birth: profile.date_of_birth || "",
        country: profile.country || "",
      });
      setProfileImage(profile.profile_image_url || null);
    }
    setSelectedImageFile(null);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col text-white w-full space-y-8 px-4 py-2 border border-primary rounded-lg">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col text-white w-full space-y-8 px-4 py-2 border border-primary rounded-lg">
        <div className="text-red-500">Error loading profile</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white w-full space-y-8 px-4 py-2 border border-primary rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <p className="text-sm text-[#AEAEAE]">
            Update your personal information and contact details
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Image Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-600 overflow-hidden border-2 border-primary">
            {profileImage ? (
              <Image
                src={profileImage}
                height={100}
                width={100}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-2xl font-semibold">
                  {formData.full_name?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          <input
            ref={fileInputRef}
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {isEditing && selectedImageFile && (
          <p className="text-sm text-green-400">
            New image selected: {selectedImageFile.name}
          </p>
        )}
      </div>

      {/* Form Section */}
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 1️⃣ Name Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="full_name" className="text-sm text-gray-300">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
              !isEditing ? "cursor-not-allowed opacity-70" : ""
            }`}
          />
        </div>

        {/* 2️⃣ Email + Phone Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white cursor-not-allowed opacity-70"
            />
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="phone_number" className="text-sm text-gray-300">
              Phone No
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="text"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
                !isEditing ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
          </div>
        </div>

        {/* 3️⃣ Gender + Date of Birth Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="gender" className="text-sm text-gray-300">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full rounded-lg border border-primary bg-black px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary  ${
                !isEditing ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="date_of_birth" className="text-sm text-gray-300">
              Date of Birth
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
                !isEditing ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
          </div>
        </div>

        {/* 4️⃣ Country Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="country" className="text-sm text-gray-300">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
              !isEditing ? "cursor-not-allowed opacity-70" : ""
            }`}
          />
        </div>

        {/* 5️⃣ Address Textarea */}
        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="text-sm text-gray-300">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
              !isEditing ? "cursor-not-allowed opacity-70" : ""
            }`}
          />
        </div>

        {/* 6️⃣ Action Row */}
        <div
          className={`flex ${
            isEditing ? "justify-between items-center" : "justify-end"
          } mt-4`}
        >
          {isEditing && (
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-primary text-white hover:opacity-90"
                onClick={handleSaveChanges}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-white border-primary hover:bg-primary/10"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          )}

        </div>
      </form>
    </div>
  );
};
