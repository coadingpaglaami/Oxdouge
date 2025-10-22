import { Button } from "@/components/ui/button";
import Image from "next/image";

export const ContactForm = () => {
  return (
    <div className="border border-primary flex flex-col gap-6 p-6 rounded-xl w-full max-w-2xl mx-auto">
      {/* Response Time Info */}
      <div className="flex items-center justify-center gap-2 text-sm text-foreground/80">
        <div className="p-2 rounded-full bg-primary/25">
          <Image src="/contactus/clock.svg" alt="clock icon" width={24} height={24} />
        </div>
        <p className="text-[#CDCDCD]">We typically respond within 24 hours</p>
      </div>

      {/* Contact Form */}
      <form className="flex flex-col gap-4 w-full">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Name</label>
          <input
            type="text"
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Email</label>
          <input
            type="email"
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white"
          />
        </div>

        {/* Subject Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Subject</label>
          <input
            type="text"
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md focus:outline-none text-white"
          />
        </div>

        {/* Message Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Message</label>
          <textarea
            rows={5}
            className="border border-primary/40 bg-transparent px-3 py-2 rounded-md resize-none focus:outline-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button className="w-3/4">Send</Button>
        </div>
      </form>
    </div>
  );
};