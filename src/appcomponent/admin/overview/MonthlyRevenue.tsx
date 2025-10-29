"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface RevenueDataProps {
  data: Array<{
    period: string;
    total_revenue: number;
    orders_completed: number;
  }>;
  period: "yearly" | "monthly" | "weekly";
  setPeriod: (period: "yearly" | "monthly" | "weekly") => void;
}

export const Revenue = ({ data, period, setPeriod }: RevenueDataProps) => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Format data for chart
  const chartData = data.map((item) => ({
    period: item.period,
    revenue: item.total_revenue,
  }));

  const periodLabels = {
    yearly: "Yearly",
    monthly: "Monthly",
    weekly: "Weekly",
  };

  return (
    <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-zinc-300">Revenue Trend</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm text-zinc-300 transition-colors flex items-center gap-2">
            {periodLabels[period]}
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-700 border-zinc-600">
            <DropdownMenuItem 
              onClick={() => setPeriod("yearly")}
              className="text-zinc-300 hover:bg-zinc-600 cursor-pointer"
            >
              Yearly
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setPeriod("monthly")}
              className="text-zinc-300 hover:bg-zinc-600 cursor-pointer"
            >
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setPeriod("weekly")}
              className="text-zinc-300 hover:bg-zinc-600 cursor-pointer"
            >
              Weekly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ResponsiveContainer width="100%" height={isMobile ? 200 : 400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis
            dataKey="period"
            stroke="#71717a"
            tick={{ fill: "#71717a", fontSize: 12 }}
          />
          <YAxis stroke="#71717a" tick={{ fill: "#71717a", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: "6px",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#eab308"
            strokeWidth={2}
            dot={{ fill: "#eab308", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};