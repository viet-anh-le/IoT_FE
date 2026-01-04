import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { WarningAmber } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  isLoading = false,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={isLoading ? undefined : onClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: { borderRadius: 12, padding: "8px" },
      }}
    >
      <DialogTitle className="flex items-center gap-2 text-slate-800">
        <WarningAmber className="text-orange-500" />
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id="alert-dialog-slide-description"
          className="text-slate-600"
        >
          {content}
        </DialogContentText>
      </DialogContent>

      <DialogActions style={{ padding: "0 24px 16px" }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isLoading}
          className="text-slate-500 hover:bg-slate-50"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 shadow-none"
        >
          {isLoading ? "Đang xử lý..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
