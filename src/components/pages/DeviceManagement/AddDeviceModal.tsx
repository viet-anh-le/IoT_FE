import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Device, DeviceConfig } from "@/types/device.type";

interface DeviceFormInputs {
  device_id: string;
  device_name: string;
  latitude: number;
  longitude: number;
  config: DeviceConfig;
}

interface AddDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceFormInputs) => Promise<void> | void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { register, handleSubmit, reset } = useForm<DeviceFormInputs>({
    defaultValues: {
      device_id: "",
      device_name: "",
      latitude: 0,
      longitude: 0,
      config: {
        temperature: { min: 0, max: 50, level: "INFO" },
        humidity: { min: 20, max: 80, level: "INFO" },
        notifications: {
          type: "slack",
          webhook: "https://example.com/webhook",
          notification_cooldown: 180000,
        },
      },
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleFormSubmit = (data: DeviceFormInputs) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { borderRadius: 12, padding: "10px" },
      }}
    >
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h6" component="div" fontWeight="bold">
          Thêm thiết bị
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers style={{ border: "none" }}>
          <Grid container spacing={2}>
            {/* ID Thiết bị */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Id của thiết bị"
                placeholder="VD: sensor_001"
                variant="outlined"
                {...register("device_id")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tên thiết bị"
                placeholder="VD: Living Room Sensor"
                variant="outlined"
                {...register("device_name")}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                {...register("latitude", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                {...register("longitude", { valueAsNumber: true })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                className="text-slate-500 mt-2 font-bold"
              >
                Cấu hình Nhiệt độ
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Temp Min (°C)"
                type="number"
                {...register("config.temperature.min", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Temp Max (°C)"
                type="number"
                {...register("config.temperature.max", { valueAsNumber: true })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                className="text-slate-500 mt-2 font-bold"
              >
                Cấu hình Độ ẩm
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Humidity Min (%)"
                type="number"
                {...register("config.humidity.min", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Humidity Max (%)"
                type="number"
                {...register("config.humidity.max", { valueAsNumber: true })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                className="text-slate-500 mt-2 font-bold"
              >
                Cấu hình Thông báo
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Thời gian giãn cách (ms)"
                type="number"
                {...register("config.notifications.notification_cooldown", {
                  valueAsNumber: true,
                })}
              />
            </Grid>

            <input type="hidden" {...register("config.notifications.type")} />
            <input type="hidden" {...register("config.temperature.level")} />
            <input type="hidden" {...register("config.humidity.level")} />
          </Grid>
        </DialogContent>

        <DialogActions style={{ padding: "20px" }}>
          <Button
            onClick={onClose}
            variant="text"
            color="inherit"
            style={{ fontWeight: 600, color: "#666" }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "#2563eb",
              fontWeight: 600,
              padding: "6px 24px",
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDeviceModal;
