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
import { User } from "@/types/user.type";

interface EditUserFormInputs {
  username: string;
}

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: EditUserFormInputs) => Promise<void> | void;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  onSubmit,
  user,
}) => {
  const { register, handleSubmit, reset, setValue } =
    useForm<EditUserFormInputs>();

  useEffect(() => {
    if (open && user) {
      setValue("username", user.username);
    } else {
      reset();
    }
  }, [open, user, setValue, reset]);

  const handleFormSubmit = (data: EditUserFormInputs) => {
    if (user) {
      onSubmit(user.id, data);
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
          Chỉnh sửa người dùng
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers style={{ border: "none" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                value={user?.gmail || ""}
                disabled
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  style: { borderRadius: 8 },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tên đăng nhập mới"
                placeholder="Nhập username mới"
                variant="outlined"
                {...register("username", { required: true })}
                autoFocus
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
            Lưu thay đổi
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserModal;
