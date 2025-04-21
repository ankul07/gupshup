import React from "react";
import { Grid, Bookmark } from "lucide-react";

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "posts", icon: Grid, label: "Posts" },
    { id: "saved", icon: Bookmark, label: "Saved" },
    // { id: "tagged", icon: Tag, label: "Tagged" },
  ];

  return (
    <div className="border-t border-gray-200 mt-4">
      <div className="flex justify-around sm:justify-center sm:gap-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col sm:flex-row items-center sm:gap-2 py-3 px-4 sm:px-8 transition-all duration-300 border-b-2 ${
              activeTab === tab.id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-purple-500"
            }`}
          >
            <tab.icon size={20} />
            <span className="text-sm mt-1 sm:mt-0">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
