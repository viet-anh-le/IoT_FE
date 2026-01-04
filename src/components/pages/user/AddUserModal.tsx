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

interface UserFormInputs {
  username: string;
  gmail: string;
  password: string;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormInputs) => Promise<void> | void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { register, handleSubmit, reset } = useForm<UserFormInputs>({
    defaultValues: {
      username: "",
      gmail: "",
      password: "",
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleFormSubmit = (data: UserFormInputs) => {
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
          Thêm người dùng
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
                label="Tên đăng nhập"
                placeholder="VD: newuser"
                variant="outlined"
                {...register("username")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                placeholder="VD: newuser@example.com"
                type="email"
                variant="outlined"
                {...register("gmail")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                variant="outlined"
                {...register("password")}
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
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;
