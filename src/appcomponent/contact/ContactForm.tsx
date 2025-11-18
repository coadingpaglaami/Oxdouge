"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useContactUsMutation } from "@/api/profileApi";
import { toast } from "sonner";

import { getAccessToken, getAuthTokens } from "@/lib/token";
import { getUserInfoFromToken } from "@/lib/jwthelper";

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormPayload>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const {email}=getAuthTokens();

  const [isUserAutoFilled, setIsUserAutoFilled] = useState(false);
  const [submitContact, { isLoading }] = useContactUsMutation();

  // ✅ Auto-fill from token
  useEffect(() => {
    const tokenInfo = getAccessToken();
    console.log("Retrieved token info:", tokenInfo);
    if (tokenInfo) {
      console.log("Decoding token to get user info...");
      const user = getUserInfoFromToken(tokenInfo);
      console.log("Auto-filling contact form for user:", user);
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email!==undefined?user.email:email || "",
        }));
        setIsUserAutoFilled(true); // mark as prefilled
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsUserAutoFilled(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // ✅ Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);

      await submitContact(formDataToSend).unwrap();
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      resetForm();
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage =
        error?.message || "Failed to send message. Please try again later.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="border border-primary flex flex-col gap-6 p-6 rounded-xl w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 text-sm text-foreground/80">
        <div className="p-2 rounded-full bg-primary/25">
          <Image src="/contactus/clock.svg" alt="clock icon" width={24} height={24} />
        </div>
        <p className="text-[#CDCDCD]">We typically respond within 24 hours</p>
      </div>

      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isUserAutoFilled} // 🔒 disabled if auto-filled
            required
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isUserAutoFilled} // 🔒 disabled if auto-filled
            required
          />
        </div>

        {/* Subject Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white"
            disabled={isLoading}
            required
          />
        </div>

        {/* Message Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Message</label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md resize-none focus:outline-none text-white"
            disabled={isLoading}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" className="w-3/4" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
};



// "use client";
// import React, {  useState } from "react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useContactUsMutation } from "@/api/profileApi"; // Adjust import path as needed
// import { toast } from "sonner";
// import { getUserInfoFromToken } from "@/lib/jwthelper";
// import { getAccessToken } from "@/lib/token";

// export interface ContactFormPayload {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// }

// export const ContactForm = () => {
//   const [formData, setFormData] = useState<ContactFormPayload>({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const tokenInfo = getAccessToken();

//   const token = getUserInfoFromToken(tokenInfo);
//   const [submitContact, { isLoading }] = useContactUsMutation();

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ): void => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const resetForm = (): void => {
//     setFormData({
//       name: "",
//       email: "",
//       subject: "",
//       message: "",
//     });
//   };

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ): Promise<void> => {
//     e.preventDefault();

//     // Validation
//     if (!formData.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }

//     if (!formData.email.trim()) {
//       toast.error("Email is required");
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     if (!formData.subject.trim()) {
//       toast.error("Subject is required");
//       return;
//     }

//     if (!formData.message.trim()) {
//       toast.error("Message is required");
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("email", formData.email);
//       formDataToSend.append("subject", formData.subject);
//       formDataToSend.append("message", formData.message);
//       await submitContact(formDataToSend).unwrap();
//       toast.success(
//         "Message sent successfully! We'll get back to you within 24 hours."
//       );
//       resetForm();
//     } catch (err: unknown) {
//       // safely type cast
//       const error = err as Error; // or more strictly if you know the shape
//       const errorMessage =
//         error?.message || "Failed to send message. Please try again later.";

//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="border border-primary flex flex-col gap-6 p-6 rounded-xl w-full max-w-2xl mx-auto">
//       {/* Response Time Info */}
//       <div className="flex items-center justify-center gap-2 text-sm text-foreground/80">
//         <div className="p-2 rounded-full bg-primary/25">
//           <Image
//             src="/contactus/clock.svg"
//             alt="clock icon"
//             width={24}
//             height={24}
//           />
//         </div>
//         <p className="text-[#CDCDCD]">We typically respond within 24 hours</p>
//       </div>

//       {/* Contact Form */}
//       <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
//         {/* Name Field */}
//         <div className="flex flex-col gap-2">
//           <label className="text-sm text-white">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white"
//             disabled={isLoading}
//             required
//           />
//         </div>

//         {/* Email Field */}
//         <div className="flex flex-col gap-2">
//           <label className="text-sm text-white">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white"
//             disabled={isLoading}
//             required
//           />
//         </div>

//         {/* Subject Field */}
//         <div className="flex flex-col gap-2">
//           <label className="text-sm text-white">Subject</label>
//           <input
//             type="text"
//             name="subject"
//             value={formData.subject}
//             onChange={handleInputChange}
//             className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white"
//             disabled={isLoading}
//             required
//           />
//         </div>

//         {/* Message Textarea */}
//         <div className="flex flex-col gap-2">
//           <label className="text-sm text-white">Message</label>
//           <textarea
//             name="message"
//             rows={5}
//             value={formData.message}
//             onChange={handleInputChange}
//             className="border border-primary/40 bg-transparent px-3 py-2 rounded-md resize-none focus:outline-none text-white"
//             disabled={isLoading}
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-center">
//           <Button type="submit" className="w-3/4" disabled={isLoading}>
//             {isLoading ? "Sending..." : "Send"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };
