import React from "react";
import { Menu, Notifications, Person } from "@mui/icons-material";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-700 focus:outline-none"
        >
          <Menu />
        </button>
        <h2 className="text-slate-700 font-semibold text-lg">Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Notifications />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
            4
          </span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">viet anh</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
            <Person />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
