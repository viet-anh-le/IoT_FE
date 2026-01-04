import { httpClient } from "@/http/http-client";
import { ApiResponse, Device } from "@/types/device.type";

export const deviceService = {
  getAllDevices: async () => {
    const response = await httpClient.get<ApiResponse>("/api/devices");
    return response.data;
  },

  createDevice: async (deviceData: any) => {
    const response = await httpClient.post<Device>("/api/devices", deviceData);
    return response.data;
  },
};
