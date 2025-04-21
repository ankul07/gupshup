// File: src/components/profile/SideMenu.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { X, LogOut } from "lucide-react";

const SideMenu = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-xl flex flex-col z-50 border-l">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            GupShup
          </h1>
          <button className="p-2" onClick={onClose}>
            <X size={28} className="text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Menu items can be added here */}
      </div>

      <div className="p-6 border-t">
        <NavLink
          to="#"
          onClick={onLogout}
          className="flex items-center gap-4 text-red-500 hover:text-red-600 text-lg"
        >
          <LogOut size={24} /> Logout
        </NavLink>
      </div>
    </div>
  );
};

export default SideMenu;
