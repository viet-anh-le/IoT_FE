import { httpClient } from "@/http/http-client";
import { DevicesResponse, StatsResponse } from "@/types/device.type";

export const deviceService = {
  getAllDevices: async () => {
    const response = await httpClient.get<DevicesResponse>("/api/devices");
    return response.data;
  },

  async updateDevice(id: string, payload: any) {
    return httpClient.put(`/api/devices/${id}`, payload);
  },

  async deleteDevice(id: string) {
    return httpClient.delete(`/api/devices/${id}`);
  },
  getStats: async () => {
    const response = await httpClient.get<StatsResponse>("/api/devices/stats");
    return response.data;
  },
};
