import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  Computer,
  Sensors,
  Search,
  Router,
  MeetingRoom,
  Tungsten,
  WindPower,
  DoorSliding,
  Videocam,
  Edit,
  Delete,
  LocationOn,
} from "@mui/icons-material";

import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import { Device, RoomData, StatItem } from "@/types/device.type";
import { deviceService } from "@/services/device.service";

import EditDeviceModal, {
  UpdateDevicePayload,
} from "@/components/pages/device/EditDeviceModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface FlatDevice extends Device {
  roomName: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const TYPE_COLORS = {
  light: "#F59E0B",
  fan: "#3B82F6",
  sensor: "#10B981",
  gate: "#6366F1",
  camera: "#EF4444",
};

const DeviceManagement: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [flatDevices, setFlatDevices] = useState<FlatDevice[]>([]);
  const [statsRoom, setStatsRoom] = useState<StatItem[]>([]);
  const [statsType, setStatsType] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // State edit
  const [selectedDevice, setSelectedDevice] = useState<FlatDevice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // State delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<FlatDevice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, devicesRes] = await Promise.all([
        deviceService.getStats(),
        deviceService.getAllDevices(),
      ]);

      if (statsRes.success) {
        setStatsRoom(statsRes.by_room);
        setStatsType(statsRes.by_type);
      }

      if (devicesRes.success) {
        setRooms(devicesRes.data);
        const flattened = devicesRes.data.flatMap((room) =>
          room.devices.map((device) => ({
            ...device,
            roomName: room.name,
          }))
        );
        setFlatDevices(flattened);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: (iconRetina as any).src || iconRetina,
        iconUrl: (iconMarker as any).src || iconMarker,
        shadowUrl: (iconShadow as any).src || iconShadow,
      });
    })();
    fetchData();
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "light":
        return <Tungsten fontSize="small" />;
      case "fan":
        return <WindPower fontSize="small" />;
      case "gate":
        return <DoorSliding fontSize="small" />;
      case "camera":
        return <Videocam fontSize="small" />;
      case "sensor":
        return <Sensors fontSize="small" />;
      default:
        return <Router fontSize="small" />;
    }
  };

  const getDeviceColor = (type: string) => {
    const key = type.toLowerCase() as keyof typeof TYPE_COLORS;
    return TYPE_COLORS[key] || "#64748B";
  };

  const filteredDevices = flatDevices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (device: FlatDevice) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (id: string, data: UpdateDevicePayload) => {
    try {
      await deviceService.updateDevice(id, data);

      fetchData();
      setIsEditModalOpen(false);
      setSelectedDevice(null);
    } catch (error) {
      console.error("Failed to update device:", error);
    }
  };

  const handleDeleteClick = (device: FlatDevice) => {
    setDeviceToDelete(device);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;

    setIsDeleting(true);
    try {
      await deviceService.deleteDevice(deviceToDelete.id);

      await fetchData();
      setDeleteDialogOpen(false);
      setDeviceToDelete(null);
    } catch (error) {
      console.error("Failed to delete device:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-fadeIn">
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 pt-10 pb-20 shadow-lg text-white overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">IoT Device Dashboard</h1>
            <p className="text-blue-100 opacity-90 text-sm">
              Quản lý & giám sát thiết bị theo thời gian thực
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Router sx={{ fontSize: 200 }} />
        </div>
      </div>

      <div className="px-4 -mt-16 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center gap-5 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600 shadow-sm">
            <Computer fontSize="large" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Tổng thiết bị</p>
            <p className="text-3xl font-bold text-slate-800">
              {flatDevices.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center gap-5 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-green-50 rounded-full text-green-600 shadow-sm">
            <MeetingRoom fontSize="large" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Số lượng phòng</p>
            <p className="text-3xl font-bold text-slate-800">{rooms.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center gap-5 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-orange-50 rounded-full text-orange-500 shadow-sm">
            <Sensors fontSize="large" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Loại thiết bị</p>
            <p className="text-3xl font-bold text-slate-800">
              {statsType.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-4 md:mx-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Thống kê theo Phòng
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsRoom}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="room"
                >
                  {statsRoom.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-500 rounded-full"></span>
            Thống kê theo Loại
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsType}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  label
                >
                  {statsType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getDeviceColor(entry.type || "")}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mx-4 md:mx-0">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <LocationOn className="text-blue-600" />
          <h3 className="font-bold text-slate-700">Bản đồ vị trí thiết bị</h3>
        </div>

        <div className="h-[400px] w-full relative z-0">
          <MapContainer
            center={[20.980205, 105.84453]}
            zoom={19}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flatDevices.map((device) => {
              const hasLocation =
                device.location &&
                device.location.coordinates &&
                device.location.coordinates.length === 2;

              if (!hasLocation) return null;
              const [lng, lat] = device.location!.coordinates;
              return (
                <Marker key={device.id} position={[lat, lng]}>
                  <Popup>
                    <div className="p-2 text-center min-w-[150px]">
                      <div className="mb-2 text-indigo-600">
                        {getDeviceIcon(device.type)}
                      </div>
                      <b className="text-slate-800 block mb-1 text-sm">
                        {device.name}
                      </b>
                      <span className="text-xs text-slate-500 block bg-slate-100 rounded px-2 py-1 mx-auto w-fit mb-1">
                        {device.roomName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {device.controller_key}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden mx-4 md:mx-0">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <Router />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Danh sách thiết bị
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                Hiển thị {filteredDevices.length} thiết bị
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative group w-full sm:w-80 transition-all duration-300 focus-within:w-full sm:focus-within:w-96">
              <input
                type="text"
                placeholder="Tìm kiếm thiết bị, phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none shadow-sm"
              />
              <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4 first:pl-8 last:pr-8">Thiết bị</th>
                <th className="px-6 py-4">Phòng / Vị trí</th>
                <th className="px-6 py-4">Loại</th>
                <th className="px-6 py-4">Cập nhật lần cuối</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span className="text-slate-400 text-sm font-medium">
                        Đang đồng bộ dữ liệu...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Router style={{ fontSize: 40 }} />
                    </div>
                    <p className="text-slate-500 font-medium">
                      Không tìm thấy thiết bị nào
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="group transition-all duration-200 hover:bg-slate-50/50"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: getDeviceColor(device.type),
                          }}
                        >
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                            {device.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center text-indigo-500">
                          <MeetingRoom style={{ fontSize: 18 }} />
                        </div>
                        <span className="text-slate-700 font-medium text-md">
                          {device.roomName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-opacity-10"
                        style={{
                          color: getDeviceColor(device.type),
                          backgroundColor: `${getDeviceColor(device.type)}20`,
                        }}
                      >
                        {device.type}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-medium text-sm">
                          {new Date(device.updated_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span className="text-slate-400 text-xs mt-0.5 font-medium">
                          {new Date(device.updated_at).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Cập nhật"
                          onClick={() => handleEditClick(device)}
                        >
                          <Edit />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          title="Xóa"
                          onClick={() => handleDeleteClick(device)}
                        >
                          <Delete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EditDeviceModal
        open={isEditModalOpen}
        device={selectedDevice}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateSubmit}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Xóa thiết bị"
        content={`Bạn có chắc chắn muốn xóa thiết bị "${deviceToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa thiết bị"
        cancelText="Hủy bỏ"
        isLoading={isDeleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DeviceManagement;
