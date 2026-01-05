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
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { Device } from "@/types/device.type";

export interface UpdateDevicePayload {
  room: string;
  name: string;
  type: string;
  config: {
    pin?: string | number;
    active_low?: boolean;
    [key: string]: any;
  };
}

interface EditDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateDevicePayload) => void;
  device: (Device & { roomName?: string }) | null; // Hỗ trợ cả FlatDevice
}

const DEVICE_TYPES = [
  { value: "light", label: "Đèn (Light)" },
  { value: "fan", label: "Quạt (Fan)" },
  { value: "sensor", label: "Cảm biến (Sensor)" },
  { value: "gate", label: "Cổng (Gate)" },
  { value: "camera", label: "Camera" },
];

const EditDeviceModal: React.FC<EditDeviceModalProps> = ({
  open,
  onClose,
  onSubmit,
  device,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateDevicePayload>({
    defaultValues: {
      name: "",
      room: "",
      type: "",
      config: {
        pin: "",
        active_low: false,
      },
    },
  });

  useEffect(() => {
    if (open && device) {
      reset({
        name: device.name,
        room: device.roomName || "",
        type: device.type ? device.type.toLowerCase() : "",
        config: {
          pin: device.config?.pin || "",
          active_low: device.config?.active_low || false,
        },
      });
    }
  }, [open, device, reset]);

  const handleFormSubmit = (data: UpdateDevicePayload) => {
    if (device) {
      onSubmit(device.id, data);
      onClose();
    }
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
          Cập nhật thiết bị
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers style={{ border: "none" }}>
          <Grid container spacing={2}>
            {/* --- Thông tin chung --- */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                className="text-slate-500 font-bold mb-1"
              >
                Thông tin chung
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tên thiết bị"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name ? "Vui lòng nhập tên thiết bị" : ""}
                {...register("name", { required: true })}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Phòng / Vị trí"
                variant="outlined"
                {...register("room", { required: true })}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Vui lòng chọn loại thiết bị" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Loại thiết bị"
                    variant="outlined"
                    error={!!errors.type}
                    helperText={errors.type ? errors.type.message : ""}
                  >
                    {DEVICE_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography
                variant="subtitle2"
                className="text-slate-500 mt-2 font-bold"
              >
                Cấu hình (Config)
              </Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="PIN (GPIO)"
                placeholder="VD: D1, A0, 13"
                variant="outlined"
                {...register("config.pin")}
              />
            </Grid>

            <Grid size={{ xs: 6 }} className="flex items-center">
              <Controller
                name="config.active_low"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <span className="text-slate-700 text-sm font-medium">
                        Active LOW
                        <span className="block text-xs text-slate-400 font-normal">
                          (Kích hoạt mức thấp)
                        </span>
                      </span>
                    }
                  />
                )}
              />
            </Grid>
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
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditDeviceModal;
