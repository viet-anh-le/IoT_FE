import React, { useEffect, useState } from "react";
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  DeleteSweep,
  CheckCircle,
} from "@mui/icons-material";
import {
  Badge,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { User } from "@/types/user.type";
import { useNotification } from "@/contexts/NotificationContext";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [user, setUser] = useState<User | null>(null);

  const { notifications, unreadCount, markAllAsRead, clearNotifications } =
    useNotification();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {}
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    markAllAsRead();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-700 focus:outline-none"
        >
          <MenuIcon />
        </button>
        <h2 className="text-slate-700 font-semibold text-lg">Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        <IconButton
          onClick={handleClick}
          size="large"
          aria-controls={open ? "notification-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="relative text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="notification-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              width: 360,
              maxHeight: 480,
              overflowY: "auto",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Thông báo
            </Typography>
            {notifications.length > 0 && (
              <Button
                size="small"
                startIcon={<DeleteSweep />}
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotifications();
                }}
              >
                Xóa tất cả
              </Button>
            )}
          </Box>
          <Divider />

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              <CheckCircle sx={{ fontSize: 40, color: "#ddd", mb: 1 }} />
              <Typography variant="body2">Không có thông báo mới</Typography>
            </Box>
          ) : (
            notifications.map((noti) => (
              <MenuItem
                key={noti.id}
                onClick={handleClose}
                sx={{ whiteSpace: "normal", py: 1.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={noti.isRead ? "normal" : "bold"}
                      color={
                        noti.type === "FIRE" || noti.type === "GAS"
                          ? "error.main"
                          : "text.primary"
                      }
                    >
                      {noti.title}
                    </Typography>
                    {!noti.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {noti.body}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {formatDistanceToNow(noti.timestamp, {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700">
              {user?.username || "Guest"}
            </p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              {user?.role || ""}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 overflow-hidden">
            <Person />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
