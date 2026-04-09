/* eslint-disable react/prop-types */
import {
  Box,
  Paper,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAddBookingStatusMutation } from "../../store/apis/BookingsAPI";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import useUserPermissions from "../../utils/useSubAdmin";

export default function BookingStatusComponent({ data }) {
  const { isSubAdmin } = useUserPermissions();

  // Gold controls
  const [goldBooking, setGoldBooking] = useState(false);
  const [goldRateVisible, setGoldRateVisible] = useState(false);

  // Silver controls
  const [silverBooking, setSilverBooking] = useState(false);
  const [silverRateVisible, setSilverRateVisible] = useState(false);

  const [addBookingStatus, { isLoading }] = useAddBookingStatusMutation();

  const defaultFormFields = {
    start_time: "",
    end_time: "",
    clear_pending_order_time: "",
  };

  const { values, handleChange, handleSubmit, setValues } = useFormik({
    initialValues: defaultFormFields,
    enableReinitialize: true,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      // Gold
      gold_booking_status: goldBooking ? 1 : 0,
      current_rate_status: goldRateVisible ? 1 : 0,
      // Silver
      silver_booking_status: silverBooking ? 1 : 0,
      silver_rate_status: silverRateVisible ? 1 : 0,
      // Legacy global status — keep ON as long as any booking is open
      status: (goldBooking || silverBooking) ? 1 : 0,
    };
    try {
      const res = await addBookingStatus(payload);
      if (res.data.code == 200) {
        toast.success("Booking status updated");
      }
    } catch (error) {
      console.log("🚀 ~ handleFormSubmit ~ error:", error);
    }
  };

  useEffect(() => {
    if (data) {
      setValues({
        start_time: data.start_time || "",
        end_time: data.end_time || "",
        clear_pending_order_time: data.clear_pending_order_time || "",
      });
      setGoldBooking(data.gold_booking_status == 1);
      setGoldRateVisible(data.current_rate_status == 1);
      setSilverBooking(data.silver_booking_status == 1);
      setSilverRateVisible(data.silver_rate_status == 1);
    }
  }, [data, setValues]);

  const switchSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 1.5,
    px: 1,
    py: 0.5,
    borderRadius: "8px",
    bgcolor: "#f9f9f9",
  };

  return (
    <Paper sx={{
      p: 3,
      borderRadius: "15px",
      bgcolor: "white",
      color: "black",
      "& .MuiTypography-root": { color: "black" },
      "& .MuiOutlinedInput-root": { background: "#f4f4f4", color: "black" },
      "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" },
      "& .MuiFormHelperText-root": { color: "rgba(0, 0, 0, 0.7)" }
    }}>

      {/* ── GOLD SECTION ── */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "#b8860b !important" }}>
        🟡 Gold
      </Typography>
      <Box sx={switchSx}>
        <Typography>Gold Booking</Typography>
        <FormControlLabel
          control={
            <Switch
              disabled={isSubAdmin}
              checked={goldBooking}
              onChange={() => setGoldBooking(!goldBooking)}
              color="warning"
            />
          }
          label={goldBooking ? "Open" : "Closed"}
          labelPlacement="start"
          sx={{ m: 0 }}
        />
      </Box>
      <Box sx={switchSx}>
        <Typography>Gold Rate Visible</Typography>
        <FormControlLabel
          control={
            <Switch
              disabled={isSubAdmin}
              checked={goldRateVisible}
              onChange={() => setGoldRateVisible(!goldRateVisible)}
              color="warning"
            />
          }
          label={goldRateVisible ? "Shown" : "Hidden"}
          labelPlacement="start"
          sx={{ m: 0 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ── SILVER SECTION ── */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "#708090 !important" }}>
        ⚪ Silver
      </Typography>
      <Box sx={switchSx}>
        <Typography>Silver Booking</Typography>
        <FormControlLabel
          control={
            <Switch
              disabled={isSubAdmin}
              checked={silverBooking}
              onChange={() => setSilverBooking(!silverBooking)}
              color="default"
            />
          }
          label={silverBooking ? "Open" : "Closed"}
          labelPlacement="start"
          sx={{ m: 0 }}
        />
      </Box>
      <Box sx={switchSx}>
        <Typography>Silver Rate Visible</Typography>
        <FormControlLabel
          control={
            <Switch
              disabled={isSubAdmin}
              checked={silverRateVisible}
              onChange={() => setSilverRateVisible(!silverRateVisible)}
              color="default"
            />
          }
          label={silverRateVisible ? "Shown" : "Hidden"}
          labelPlacement="start"
          sx={{ m: 0 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ── TIME SLOTS ── */}
      <Typography variant="subtitle2" sx={{ mb: 1.5, color: "rgba(0,0,0,0.6) !important" }}>
        Booking Time Slot
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { sm: "row", xs: "column" }, width: "100%", gap: "10px" }}>
        <Box width={"100%"}>
          <Typography>Start time</Typography>
          <TextField
            type="time"
            disabled={isSubAdmin}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            value={values.start_time}
            helperText="No orders before this time"
            name="start_time"
            sx={{
              "& .MuiOutlinedInput-input": { color: "black", border: "1px solid #ccc", borderRadius: "5px" },
              "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" },
              "& .MuiFormHelperText-root": { color: "rgba(0, 0, 0, 0.7)" }
            }}
          />
        </Box>
        <Box width={"100%"}>
          <Typography>End time</Typography>
          <TextField
            type="time"
            onChange={handleChange}
            variant="outlined"
            disabled={isSubAdmin}
            fullWidth
            helperText="No orders past this time"
            name="end_time"
            value={values.end_time}
            sx={{
              "& .MuiOutlinedInput-input": { color: "black", border: "1px solid #ccc", borderRadius: "5px" },
              "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" },
              "& .MuiFormHelperText-root": { color: "rgba(0, 0, 0, 0.7)" }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <LoadingButton
          loading={isLoading}
          disabled={isSubAdmin}
          variant="contained"
          onClick={handleSubmit}
        >
          Save
        </LoadingButton>
      </Box>
    </Paper>
  );
}
