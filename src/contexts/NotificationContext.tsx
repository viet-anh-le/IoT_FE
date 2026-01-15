import React, { createContext, useContext, useState, useEffect } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  isRead: boolean;
  type?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (title: string, body: string, data?: any) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("app_notifications");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Lỗi đọc dữ liệu cũ:", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("app_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (title: string, body: string, data?: any) => {
    const newNoti: NotificationItem = {
      id: Date.now().toString(),
      title,
      body,
      timestamp: Date.now(),
      isRead: false,
      type: data?.alertType || "INFO",
    };
    setNotifications((prev) => {
      const newList = [newNoti, ...prev];
      return newList.slice(0, 20);
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
