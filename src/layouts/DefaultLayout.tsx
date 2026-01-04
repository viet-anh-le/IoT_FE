import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layouts/Sidebar";
import Header from "@/components/layouts/Header";

const DefaultLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar isOpen={sidebarOpen} />

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
