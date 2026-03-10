/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Box,
  Radio,
  Select,
  MenuItem,
  TextField,
  FormLabel,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useUpdateBookingMutation } from "../../store";
import { toast } from "react-toastify";
import { bookingsUpdateSchema } from "../../utils/ValidationSchema";
export default function EditBookingModal({ open, setOpen, editData }) {
  const [updateBookings, { isLoading }] = useUpdateBookingMutation();
  const handleClose = () => {
    setOpen(false);
  };
  const [byType, setByType] = useState("quantity");
  const formik = useFormik({
    initialValues: {
      rate: "",
      quantity: "",
      total_amount: "",
      remarks: "",
      seen: "no",
      created_by: "admin",
      is_admin: 1,
    },
    validationSchema: bookingsUpdateSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleFormChange(values);
    },
  });
  useEffect(() => {
    if (editData) {
      formik.setValues({
        rate: editData?.order?.rate || "",
        quantity: editData?.order?.quantity || "",
        total_amount: editData?.order?.total_amount || "",
        remarks: editData?.remarks || "",
        seen: editData?.seen === 1 ? "yes" : "no",
        created_by: editData?.created_by || "admin",
      });
    }
  }, [editData]);
  const handleByOptionChange = (e) => {
    setByType(e.target.value);
  };
  const handleFormChange = async (values) => {
    try {
      const res = await updateBookings({
        values: {
          ...values,
          seen: values.seen == "yes" ? 1 : 0,
        },
        id: editData?.id || "",
      });
      if (res.data.code == 200) {
        toast.success("Booking updated successfully");
        setOpen(false);
      }
    } catch (error) {
      console.log("🚀 ~ handleFormChange ~ error:", error);
      toast.error("Error while updating booking");
    }
  };
  return (
    <Dialog keepMounted open={open} onClose={handleClose}>
      <DialogTitle>Edit Booking</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Typography>Rate</Typography>
          <TextField
            name="rate"
            placeholder="Enter rate"
            type="number"
            fullWidth
            sx={{ my: 1 }}
            value={formik.values.rate}
            onChange={formik.handleChange}
            error={formik.touched.rate && Boolean(formik.errors.rate)}
            helperText={formik.touched.rate && formik.errors.rate}
          />
          <FormControl>
            <RadioGroup
              value={byType}
              onChange={handleByOptionChange}
              row
              name="byType"
            >
              <FormControlLabel
                value="quantity"
                control={<Radio />}
                label="By Quantity"
              />
              <FormControlLabel
                value="amount"
                control={<Radio />}
                label="By Amount"
              />
            </RadioGroup>
          </FormControl>
          {byType === "amount" ? (
            <TextField
              name="total_amount"
              type="number"
              fullWidth
              sx={{ mt: 1 }}
              placeholder="Enter amount"
              value={formik.values.total_amount}
              onChange={formik.handleChange}
              error={
                formik.touched.total_amount &&
                Boolean(formik.errors.total_amount)
              }
              helperText={
                formik.touched.total_amount && formik.errors.total_amount
              }
            />
          ) : (
            <TextField
              name="quantity"
              type="number"
              fullWidth
              sx={{ mt: 1 }}
              placeholder="Enter quantity in grams"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
          )}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Remarks
          </Typography>
          <TextField
            name="remarks"
            placeholder="Write remarks"
            fullWidth
            value={formik.values.remarks}
            onChange={formik.handleChange}
          />
          <Box sx={{ display: "flex", mt: 2, gap: "10px" }}>
            <Box width={"100%"}>
              <FormControl fullWidth>
                <FormLabel>Seen</FormLabel>
                <Select
                  name="seen"
                  value={formik.values.seen}
                  onChange={formik.handleChange}
                  sx={{ borderRadius: "30px" }}
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box width={"100%"}>
              <FormControl fullWidth>
                <FormLabel>Created by</FormLabel>
                <Select
                  name="created_by"
                  value={formik.values.created_by}
                  onChange={formik.handleChange}
                  sx={{ borderRadius: "30px" }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="self">Self</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              loading={isLoading}
              variant="contained"
              type="submit"
            >
              Update
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
