import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Add,
  Computer,
  Sensors,
  LocationOn,
  Search,
  Router,
  Thermostat,
  WaterDrop,
} from "@mui/icons-material";

import { Device } from "@/types/device.type";
import { deviceService } from "@/services/device.service";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import AddDeviceModal from "@/components/pages/DeviceManagement/AddDeviceModal";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await deviceService.getAllDevices();
        setDevices(data.devices || []);
      } catch (error) {
        console.error("Failed to fetch devices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const handleSelectDevice = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleAddNewDevice = async (newDeviceData: any) => {
    try {
      const createdDevice = await deviceService.createDevice(newDeviceData);
      setDevices((prev) => [...prev, createdDevice]);
      console.log("Thêm thiết bị thành công");
    } catch (error) {
      console.error("Lỗi khi thêm thiết bị:", error);
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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-50 transition flex items-center gap-2 text-sm"
          >
            <Add fontSize="small" /> Thêm thiết bị
          </button>
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
              {devices.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center gap-5 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-green-50 rounded-full text-green-600 shadow-sm">
            <Sensors fontSize="large" />
          </div>
          <div className="overflow-hidden">
            <p className="text-slate-500 text-sm font-medium">
              Thiết bị đang chọn
            </p>
            <p className="text-xl font-bold text-slate-800 truncate">
              {selectedDevice ? selectedDevice.device_name : "--"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              ID: {selectedDevice ? selectedDevice.device_id : "--"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center gap-5 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-orange-50 rounded-full text-orange-500 shadow-sm">
            <LocationOn fontSize="large" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Vị trí hiển thị
            </p>
            <p className="text-lg font-bold text-slate-800">
              {selectedDevice
                ? `${selectedDevice.location.latitude.toFixed(
                    2
                  )}, ${selectedDevice.location.longitude.toFixed(2)}`
                : "Không xác định"}
            </p>
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
            center={[21.028511, 105.854167]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {devices.map((device) => (
              <Marker
                key={device.device_id}
                position={[device.location.latitude, device.location.longitude]}
                eventHandlers={{
                  click: () => handleSelectDevice(device),
                }}
              >
                <Popup>
                  <div className="p-1 text-center">
                    <b className="text-blue-600 block mb-1">
                      {device.device_name}
                    </b>
                    <span className="text-xs text-slate-500">
                      {device.device_id}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mx-4 md:mx-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Router className="text-cyan-600" />
            <h3 className="font-bold text-slate-700 text-lg">
              Danh sách thiết bị
            </h3>
          </div>

          <div className="relative group w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm thiết bị..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:bg-white bg-slate-50"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 border-b">Device Info</th>
                <th className="p-4 border-b">Config (Temp)</th>
                <th className="p-4 border-b">Config (Humidity)</th>
                <th className="p-4 border-b">Updated At</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Chưa có thiết bị nào.
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr
                    key={device.device_id}
                    onClick={() => handleSelectDevice(device)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedDevice?.device_id === device.device_id
                        ? "bg-blue-50/60"
                        : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                          <Router fontSize="small" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {device.device_name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {device.device_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Thermostat
                          fontSize="small"
                          className="text-red-400 shrink-0"
                        />
                        <span>
                          {device.config.temperature.min}°C -{" "}
                          {device.config.temperature.max}°C
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <WaterDrop
                          fontSize="small"
                          className="text-blue-400 shrink-0"
                        />
                        <span>
                          {device.config.humidity.min}% -{" "}
                          {device.config.humidity.max}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(device.updated_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddDeviceModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddNewDevice}
      />
    </div>
  );
};

export default DeviceManagement;
