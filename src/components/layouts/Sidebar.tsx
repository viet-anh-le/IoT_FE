import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dashboard, People, Logout } from "@mui/icons-material";
import { authService } from "@/services/auth.service";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Devices Management",
      path: "/device-management",
      icon: <Dashboard />,
    },
    {
      label: "Users Management",
      path: "/users",
      icon: <People />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[#1a1f37] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      `}
    >
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <h1 className="text-white font-bold text-lg tracking-wide">
          IoT Dashboard
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors
              ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" // Active state
                  : "hover:bg-slate-800 hover:text-white"
              }`}
          >
            {React.cloneElement(item.icon as any, { fontSize: "small" })}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-md transition-colors text-sm font-medium"
        >
          <Logout fontSize="small" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
