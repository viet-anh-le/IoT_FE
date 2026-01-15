import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "@/components/layouts/Sidebar";
import Header from "@/components/layouts/Header";
import { onMessageListener } from "@/configs/firebase";
import { useNotification } from "@/contexts/NotificationContext";

const DefaultLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const unsubscribe = onMessageListener((payload: any) => {
      console.log("Foreground Notification Received:", payload);
      const title = payload?.notification?.title || "Thông báo mới";
      const body = payload?.notification?.body || "";
      addNotification(title, body, payload?.data);
      toast(
        (t) => (
          <div
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          >
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{title}</h4>
              <p className="text-sm text-gray-600">{body}</p>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#fff",
            border: "1px solid #e2e8f0",
            padding: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
        }
      );
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar isOpen={sidebarOpen} />
      <Toaster />
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
