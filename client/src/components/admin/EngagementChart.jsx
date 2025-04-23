import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EngagementChart = ({ data }) => {
  // Custom colors for the bars
  const colors = {
    Likes: "#ef4444", // red-500
    Comments: "#3b82f6", // blue-500
    Shares: "#22c55e", // green-500
    Saves: "#a855f7", // purple-500
  };

  return (
    <div className="h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [value.toLocaleString(), name]}
            labelStyle={{ color: "#374151" }}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.375rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar
            dataKey="value"
            // fill="#8884d8"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.8}
            animationDuration={1000}
            fillFunction={(entry) => colors[entry.name] || "#8884d8"}
            fill={(entry) => colors[entry.name] || "#8884d8"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementChart;
