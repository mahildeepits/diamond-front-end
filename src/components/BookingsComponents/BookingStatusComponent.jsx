/* eslint-disable react/prop-types */
import {
  Box,
  Paper,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAddBookingStatusMutation } from "../../store/apis/BookingsAPI";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import useUserPermissions from "../../utils/useSubAdmin";
export default function BookingStatusComponent({ data }) {
  const { isSubAdmin } = useUserPermissions();
  const [bookingStatus, setBookingStatus] = useState(true);
  const [hideRate, setHideRate] = useState(false);
  const [addBookingStatus, { isLoading }] = useAddBookingStatusMutation();
  const handleChangeSwitch = () => {
    setBookingStatus(!bookingStatus);
  };
  const handleChangeRateSwitch = () => {
    setHideRate(!hideRate);
  };
  const defaultFormFields = {
    start_time: "",
    end_time: "",
    clear_pending_order_time: "",
    current_rate_status: 1,
  };
  const { values, handleChange, handleSubmit, setValues } = useFormik({
    initialValues: defaultFormFields,
    enableReinitialize: true,
    onSubmit: (values) => handleFormSubmit(values),
  });
  const handleFormSubmit = async (values) => {
    const data = {
      status: hideRate ? bookingStatus : false,
      ...values,
      current_rate_status: hideRate ? 1 : 0,
    };
    if (!hideRate) {
      setBookingStatus(false);
    }
    try {
      const res = await addBookingStatus(data);
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
        start_time: data.start_time,
        end_time: data.end_time,
        clear_pending_order_time: data.clear_pending_order_time,
        current_rate_status: data.current_rate_status,
      });
      setBookingStatus(data.status == 1 ? true : false);
      setHideRate(data.current_rate_status == 1 ? true : false);
    }
  }, [data, setValues]);
  return (
    <Paper sx={{
      p: 3,
      borderRadius: "15px",
      bgcolor: "white",
      color: "black",
      "& .MuiTypography-root": { color: "black" },
      "& .MuiOutlinedInput-root": {
        background: "#f4f4f4",
        color: "black",
      },
      "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" },
      "& .MuiFormHelperText-root": { color: "rgba(0, 0, 0, 0.7)" }
    }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "start",
            width: "100%",
          }}
        >
          <Typography sx={{ mr: 2 }}>Booking Status</Typography>
          <FormControlLabel
            control={
              <Switch
                disabled={isSubAdmin}
                checked={bookingStatus}
                onChange={handleChangeSwitch}
                name="booking_status"
              />
            }
            label={bookingStatus ? "On" : "Off"}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "start",
            width: "100%",
          }}
        >
          <Typography sx={{ mr: 2 }}>Hide current rate</Typography>
          <FormControlLabel
            control={
              <Switch
                disabled={isSubAdmin}
                checked={hideRate}
                onChange={handleChangeRateSwitch}
                name="current_rate_status"
              />
            }
            label={hideRate ? "On" : "Off"}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { sm: "row", xs: "column" },
          width: "100%",
          gap: "10px",
        }}
      >
        <Box width={"100%"}>
          <Typography>Start time</Typography>
          <TextField
            type="time"
            disabled={isSubAdmin}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            value={values.start_time}
            helperText="You will not receive any orders before this time"
            name="start_time"
            sx={{
              "& .MuiOutlinedInput-input": {
                color: "black",
                border: "1px solid #ccc",
                borderRadius: "5px"
              },
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
            helperText="You will not receive any orders past this time"
            name="end_time"
            value={values.end_time}
            sx={{
              "& .MuiOutlinedInput-input": {
                color: "black",
                border: "1px solid #ccc",
                borderRadius: "5px"
              },
              "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" },
              "& .MuiFormHelperText-root": { color: "rgba(0, 0, 0, 0.7)" }
            }}
          />
        </Box>
      </Box>
      {/* <Box sx={{ width: { sm: "50%", xs: "100%" }, my: 3 }}>
        <Typography>Clear pending orders</Typography>
        <TextField
          variant="outlined"
          onChange={handleChange}
          type="time"
          fullWidth
          disabled={isSubAdmin}
          helperText="All pending orders will be deleted at this time"
          name="clear_pending_order_time"
          value={values.clear_pending_order_time}
          sx={{
            "& .MuiOutlinedInput-input": {
              color: "black",
              border: "1px solid #ccc",
              borderRadius: "5px",
            },
            "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" },
            "& .MuiFormHelperText-root": { color: "rgba(0, 0, 0, 0.7)" }
          }}
        />
      </Box> */}
      <Box sx={{ mt: 2 }}>
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
