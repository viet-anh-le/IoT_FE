import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import DeviceManagementScreen from "../pages/DeviceManagementScreen";
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
      path: "/device-management",
      element: (
        <PrivateRoute>
          <DeviceManagementScreen />
        </PrivateRoute>
      ),
    },

    {
      path: "*",
      element: <div>404 Not Found</div>,
    },
  ];

  const elements = useRoutes(routes);
  return <>{elements}</>;
}
