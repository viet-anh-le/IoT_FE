export interface DeviceConfigEnv {
  min: number;
  max: number;
  level: string;
}

export interface DeviceConfigNoti {
  type: string;
  webhook: string;
  notification_cooldown: number;
}

export interface DeviceConfig {
  temperature: DeviceConfigEnv;
  humidity: DeviceConfigEnv;
  notifications: DeviceConfigNoti;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
}

export interface Device {
  device_id: string;
  device_name: string;
  location: DeviceLocation;
  config: DeviceConfig;
  updated_at: string;
}

export interface ApiResponse {
  message: string;
  devices: Device[];
  count: number;
}
