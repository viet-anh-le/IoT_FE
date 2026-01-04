import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Add,
  FilterList,
  MoreVert,
  LocationOn,
  Sensors,
  Router,
  SettingsInputComponent,
  NotificationsActive,
  Logout,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatDistanceToNow, parseISO, differenceInMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import { ApiResponse } from "../types/device.type";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Hỏi xác nhận (UX tốt hơn)
    const isConfirm = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!isConfirm) return;

    // 2. Gọi hàm logout
    authService.logout();

    // 3. Thông báo
    toast.success("Đăng xuất thành công!");

    // 4. Điều hướng về trang login
    // Dùng replace: true để user không back lại được trang cũ
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200">
      <h1 className="text-xl font-bold text-slate-800">IoT Dashboard</h1>

      {/* Nút Đăng Xuất */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
      >
        <Logout fontSize="small" />
        Đăng xuất
      </button>
    </div>
  );
};

const mockApiResponse: ApiResponse = {
  message: "success",
  devices: [
    {
      device_id: "DEV-001",
      device_name: "DHT22 Kho Lạnh A",
      location: { latitude: 21.0285, longitude: 105.8542 },
      config: {
        temperature: { min: -10, max: 5, level: "CRITICAL" },
        humidity: { min: 40, max: 60, level: "INFO" },
        notifications: {
          type: "EMAIL",
          webhook: "https://api.hook.com/1",
          notification_cooldown: 300000,
        },
      },
      updated_at: new Date().toISOString(), // Vừa cập nhật -> Online
    },
    {
      device_id: "DEV-002",
      device_name: "ESP32 Nhà Kính",
      location: { latitude: 21.029, longitude: 105.855 },
      config: {
        temperature: { min: 20, max: 30, level: "INFO" },
        humidity: { min: 50, max: 80, level: "INFO" },
        notifications: {
          type: "SMS",
          webhook: "",
          notification_cooldown: 600000,
        },
      },
      updated_at: "2026-01-02T10:00:00.000Z", // Cũ hơn -> Offline
    },
    {
      device_id: "GW-001",
      device_name: "Gateway Tầng 1",
      location: { latitude: 21.03, longitude: 105.86 },
      config: {
        temperature: { min: 0, max: 50, level: "INFO" },
        humidity: { min: 0, max: 100, level: "INFO" },
        notifications: {
          type: "WEBHOOK",
          webhook: "https://slack.com/webhook",
          notification_cooldown: 180000,
        },
      },
      updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 phút trước -> Online
    },
    {
      device_id: "DEV-004",
      device_name: "DHT11 Phòng Server",
      location: { latitude: 21.031, longitude: 105.861 },
      config: {
        temperature: { min: 18, max: 25, level: "WARNING" },
        humidity: { min: 40, max: 50, level: "INFO" },
        notifications: {
          type: "ALL",
          webhook: "https://tele.gram/bot",
          notification_cooldown: 60000,
        },
      },
      updated_at: new Date().toISOString(),
    },
    {
      device_id: "DEV-005",
      device_name: "Soil Sensor Vườn",
      location: { latitude: 21.032, longitude: 105.862 },
      config: {
        temperature: { min: 0, max: 40, level: "INFO" },
        humidity: { min: 30, max: 90, level: "INFO" },
        notifications: {
          type: "EMAIL",
          webhook: "",
          notification_cooldown: 900000,
        },
      },
      updated_at: "2025-12-30T11:23:05.671Z", // Rất cũ -> Offline
    },
  ],
  count: 5,
};

// --- CONSTANTS ---
const COLORS = ["#0891b2", "#3b82f6", "#8b5cf6", "#f59e0b"];
const STATUS_COLORS = { active: "#16a34a", inactive: "#94a3b8" };

// --- HELPER COMPONENT ---
const StatCard = ({ title, value, icon, iconBgClass, iconColorClass }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${iconBgClass} ${iconColorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const DeviceManagementScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const devices = mockApiResponse.devices;
  const totalCount = mockApiResponse.count;

  // LOGIC: Xác định trạng thái dựa trên thời gian cập nhật (Ví dụ: < 1 tiếng là Online)
  const getDeviceStatus = (updatedAt: string) => {
    const diff = differenceInMinutes(new Date(), parseISO(updatedAt));
    return diff < 60 ? "active" : "inactive";
  };

  // LOGIC: Giả lập loại thiết bị dựa trên tên để vẽ biểu đồ
  const getDeviceType = (name: string) => {
    if (name.toLowerCase().includes("gateway")) return "Gateway";
    if (name.toLowerCase().includes("dht")) return "Temp/Humid Sensor";
    if (name.toLowerCase().includes("soil")) return "Soil Sensor";
    return "Other Device";
  };

  // 1. Data for Pie Chart (Device Types)
  const deviceTypeData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    devices.forEach((dev) => {
      const type = getDeviceType(dev.device_name);
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [devices]);

  // 2. Data for Donut Chart (Status)
  const deviceStatusData = useMemo(() => {
    const counts = { active: 0, inactive: 0 };
    devices.forEach((dev) => {
      const status = getDeviceStatus(dev.updated_at);
      if (status === "active") counts.active++;
      else counts.inactive++;
    });
    return [
      {
        name: "Đang hoạt động",
        value: counts.active,
        color: STATUS_COLORS.active,
      },
      {
        name: "Mất kết nối",
        value: counts.inactive,
        color: STATUS_COLORS.inactive,
      },
    ];
  }, [devices]);

  // 3. Filter logic
  const filteredDevices = useMemo(() => {
    return devices.filter(
      (dev) =>
        dev.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.device_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [devices, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 animate-fadeIn text-slate-600">
      <Header />
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Quản lý thiết bị
          </h1>
          <p className="text-slate-500 mt-1">
            Tổng quan và giám sát cấu hình hệ thống IoT.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5">
          <Add /> Thêm thiết bị mới
        </button>
      </div>

      {/* STATS & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stat Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <StatCard
            title="Tổng thiết bị"
            value={totalCount}
            icon={<Sensors className="h-8 w-8" />}
            iconBgClass="bg-cyan-50"
            iconColorClass="text-cyan-600"
          />
          <StatCard
            title="Đang hoạt động"
            value={deviceStatusData[0].value}
            icon={<NotificationsActive className="h-8 w-8" />}
            iconBgClass="bg-green-50"
            iconColorClass="text-green-600"
          />
          <StatCard
            title="Cảnh báo cấu hình"
            value={
              devices.filter((d) => d.config.temperature.level !== "INFO")
                .length
            }
            icon={<SettingsInputComponent className="h-8 w-8" />}
            iconBgClass="bg-orange-50"
            iconColorClass="text-orange-500"
          />
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Phân loại thiết bị
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {deviceTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    color: "#1e293b",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#334155" }}
                  cursor={false}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Trạng thái kết nối
          </h3>
          <div className="h-64 relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    color: "#1e293b",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#334155" }}
                  cursor={false}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">
                {totalCount}
              </span>
              <span className="text-xs text-slate-500">Tổng số</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEVICE LIST TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            Danh sách thiết bị
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600" />
              </div>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 text-sm rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block pl-10 p-2.5 outline-none placeholder-slate-400 hover:bg-white transition-colors"
                placeholder="Tìm theo tên hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-slate-600 transition-colors">
              <FilterList />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Thiết bị
                </th>
                <th scope="col" className="px-6 py-4">
                  Cấu hình (Temp/Hum)
                </th>
                <th scope="col" className="px-6 py-4">
                  Vị trí
                </th>
                <th scope="col" className="px-6 py-4">
                  Cập nhật cuối
                </th>
                <th scope="col" className="px-6 py-4">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => {
                const lastActive = parseISO(device.updated_at);
                const status = getDeviceStatus(device.updated_at);
                const isOnline = status === "active";
                const isGateway = device.device_name
                  .toLowerCase()
                  .includes("gateway");

                return (
                  <tr
                    key={device.device_id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isOnline
                              ? "bg-cyan-50 text-cyan-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isGateway ? <Router /> : <Sensors />}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {device.device_name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {device.device_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-slate-600">
                            Temp:
                          </span>{" "}
                          {device.config.temperature.min}° -{" "}
                          {device.config.temperature.max}°
                          {device.config.temperature.level !== "INFO" && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-600 font-bold">
                              {device.config.temperature.level}
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-slate-600">
                            Hum:
                          </span>{" "}
                          {device.config.humidity.min}% -{" "}
                          {device.config.humidity.max}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-500 gap-1">
                        <LocationOn
                          fontSize="small"
                          className="text-slate-400"
                        />
                        {device.location.latitude.toFixed(3)},{" "}
                        {device.location.longitude.toFixed(3)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-500">
                        {formatDistanceToNow(lastActive, {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isOnline ? "bg-green-500" : "bg-slate-400"
                          }`}
                        ></span>
                        <span
                          className={`text-sm font-medium ${
                            isOnline ? "text-green-600" : "text-slate-500"
                          }`}
                        >
                          {isOnline ? "Hoạt động" : "Mất kết nối"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-gray-100 rounded-full transition-all">
                        <MoreVert />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredDevices.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Không tìm thấy thiết bị nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>
            Hiển thị {filteredDevices.length} trên tổng số {totalCount} thiết bị
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-slate-300 hover:bg-gray-100 disabled:opacity-50">
              Trước
            </button>
            <button className="px-3 py-1 rounded border border-cyan-600 bg-cyan-600 text-white">
              1
            </button>
            <button className="px-3 py-1 rounded border border-slate-300 hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 rounded border border-slate-300 hover:bg-gray-100">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceManagementScreen;
