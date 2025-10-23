'use client';
import React from "react";

interface BreadcrumbProps {
  title: string;
  subtitle?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-1 p-4">
      <h1 className="text-white text-xl font-semibold">{title}</h1>
      {subtitle && <p className="text-[#9D9D9D] text-sm">{subtitle}</p>}
    </div>
  );
};