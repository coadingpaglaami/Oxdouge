"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 1600 },
  { month: "Apr", revenue: 2200 },
  { month: "May", revenue: 1900 },
  { month: "Jun", revenue: 1700 },
  { month: "Jul", revenue: 1500 },
  { month: "Aug", revenue: 2000 },
  { month: "Sep", revenue: 2400 },
  { month: "Oct", revenue: 2300 },
  { month: "Nov", revenue: 2100 },
  { month: "Dec", revenue: 2500 },
];

export const Revenue = () => {
  const [viewType] = useState("Monthly");

  return (
    <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-zinc-300">Monthly Revenue</h2>
        <button className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm text-zinc-300 transition-colors">
          {viewType} ▼
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={monthlyData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis
            dataKey="month"
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
