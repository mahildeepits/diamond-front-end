/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function DeleteModal({ open, setOpen, deleteFunc, loading, variant }) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog keepMounted open={open}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {variant === "user"
              ? "If you delete this user, all orders of this user will also be deleted Are you sure to delete this user ?"
              : "Are you sure you want to delete the data ?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              textTransform: "inherit",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            sx={{
              textTransform: "inherit",
              color: "white",
              bgcolor: "red",
            }}
            autoFocus
            startIcon={<Delete />}
            onClick={deleteFunc}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
