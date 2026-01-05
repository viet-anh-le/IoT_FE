export interface DeviceConfig {
  pin: string | number;
  active_low: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: "light" | "fan" | "sensor" | "gate" | "camera" | string;
  config: DeviceConfig;
  controller_key: string;
  created_at: string;
  updated_at: string;
}

export interface RoomData {
  name: string;
  devices: Device[];
}

export interface StatItem {
  room?: string;
  type?: string;
  count: number;
  [key: string]: any;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  by_room: { room: string; count: number }[];
  by_type: { type: string; count: number }[];
}

export interface DevicesResponse {
  success: boolean;
  data: RoomData[];
}
