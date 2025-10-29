// OverView.tsx
'use client';
import { Breadcrumb } from "@/appcomponent/reusable";
import { Card } from "./Card";
import { Revenue } from "./MonthlyRevenue";
import { RevenueData } from "./ReveneuData";
import { useGetDashboardOverviewQuery } from "@/api/dashboard";
import { useState } from "react";

export const OverView = () => {
  const [period, setPeriod] = useState<"yearly" | "monthly" | "weekly">("yearly");
  const { data: dashboardData, isLoading } = useGetDashboardOverviewQuery(period);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        title="Overview"
        subtitle="Monitor your business performance and metrics"
      />
      <div className="flex flex-col gap-4">
        <Card data={dashboardData} />
        <div className="flex flex-col md:flex-row gap-3">
          <div className="md:w-[75%] w-full">
            <Revenue 
              data={dashboardData?.revenue_trend || []} 
              period={period}
              setPeriod={setPeriod}
            />
          </div>
          <div className="md:w-[25%] w-full">
            <RevenueData data={dashboardData?.recent_activity?.recent_orders || []} />
          </div>
        </div>
      </div>
    </>
  );
};