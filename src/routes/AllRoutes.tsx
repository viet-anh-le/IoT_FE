import React from "react";
import { useRoutes, Navigate, Outlet } from "react-router-dom";

// Import các pages
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import DeviceManagement from "@/pages/DeviceManagement";
import NotFound from "@/pages/NotFound";

import DefaultLayout from "@/layouts/DefaultLayout";
import { isAuthenticated } from "../utils/auth";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = isAuthenticated();
  return isAuth ? <Navigate to="/device-management" replace /> : children;
};

export default function AllRoutes() {
  const isAuth = isAuthenticated();

  const routes = [
    {
      path: "/",
      element: (
        <Navigate to={isAuth ? "/device-management" : "/login"} replace />
      ),
    },

    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Signup />
        </PublicRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      ),
    },

    {
      element: (
        <PrivateRoute>
          <DefaultLayout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/device-management",
          element: <DeviceManagement />,
        },
      ],
    },

    {
      path: "*",
      element: <NotFound />,
    },
  ];

  const elements = useRoutes(routes);
  return <>{elements}</>;
}
