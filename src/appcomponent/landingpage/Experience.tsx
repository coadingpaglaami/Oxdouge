"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const Experience = () => {
  const router = useRouter();
  return (
    <div className="bg-[#231D0D] flex flex-col items-center justify-center text-center py-24">
      {/* ---------- Headings ---------- */}
      <div className="flex flex-col leading-tight">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Ready To Experience
        </h2>
        <h2 className="text-3xl md:text-4xl font-semibold text-primary">
          Ultimate Warmth
        </h2>
      </div>

      {/* ---------- Description ---------- */}
      <p className="text-sm md:text-base text-[#C8C8C8] max-w-xl mt-4">
        Join thousands of outdoor enthusiasts who trust Not Overland for
        reliable, portable power solutions.
      </p>

      {/* ---------- Button ---------- */}
      <Button className="mt-8 flex items-center gap-2" variant='defaultGradient' onClick={()=>router.push('/products')}>
        Explore Products
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
