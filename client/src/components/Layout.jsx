// Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4">{children}</main>
    </div>
  );
};

export default Layout;
