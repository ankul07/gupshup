import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      <div className={`${color} text-white p-3 rounded-lg mr-4`}>{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
