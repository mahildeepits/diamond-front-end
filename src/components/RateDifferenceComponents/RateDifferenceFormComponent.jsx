/* eslint-disable react/prop-types */
import {
  Box,
  InputAdornment,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useAddRateDifferenceMutation } from "../../store";
import { toast } from "react-toastify";
import { CurrencyRupee } from "@mui/icons-material";
import useUserPermissions from "../../utils/useSubAdmin";
export default function RateDifferenceFormComponent({ data }) {
  const { isSubAdmin } = useUserPermissions();
  const [addRateDifference, { isLoading }] = useAddRateDifferenceMutation();
  const [nextMonthRateStatus, setNextMonthRateStatus] = useState(0);
  const defaultFormFields = {
    including_tcs: 0,
    including_tds: 0,
    next_including_tcs: 0,
    next_including_tds: 0,
    next_month_rate_status: 0,
    including_silver_tds: 0,
    next_month_silver_tds: 0,
    next_month_silver_rate_status: 0,
  };
  const { values, handleBlur, handleChange, handleSubmit, setValues, setFieldValue } =
    useFormik({
      initialValues: defaultFormFields,
      enableReinitialize: true,
      onSubmit: (values) => handleFormSubmit(values),
    });
  useEffect(() => {
    if (data) {
      setValues({
        next_including_tcs: data.next_including_tcs || 0,
        next_including_tds: data.next_including_tds || 0,
        including_tcs: data.including_tcs || 0,
        including_tds: data.including_tds || 0,
        next_month_rate_status: data.next_month_rate_status || 0,
        including_silver_tds: data.including_silver_tds || 0,
        next_month_silver_tds: data.next_month_silver_tds || 0,
        next_month_silver_rate_status: data.next_month_silver_rate_status || 0,
      });
    }
  }, [data, setValues]);
  const handleSwitchChange = (event) => {
    setFieldValue("next_month_rate_status", event.target.checked ? 1 : 0);
  };
  const handleSilverSwitchChange = (event) => {
    setFieldValue("next_month_silver_rate_status", event.target.checked ? 1 : 0);
  };
  const handleFormSubmit = async () => {
    try {
      const res = await addRateDifference(values);
      if (res.data.code == 200 || res.data.code == 201) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Paper sx={{
      p: 2,
      width: "100%",
      borderRadius: "15px",
      bgcolor: "white",
      color: "black",
      "& .MuiTypography-root": { color: "black" },
      "& .MuiOutlinedInput-root": {
        background: "#f4f4f4",
        color: "black",
      },
      "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" }
    }}>
      {/* <Box sx={{ my: 2 }}>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Enter your rate difference
          <Typography variant="caption">(With TCS)</Typography>
        </Typography>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupee color="primary" />
              </InputAdornment>
            ),
          }}
          name={"including_tcs"}
          value={values.including_tcs || ""}
          placeholder="Enter your difference here"
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          type="number"
          disabled={isSubAdmin}
        />
      </Box> */}
      <Box sx={{ my: 2 }}>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Enter your rate GOLD difference
          {/* <Typography variant="caption">(With TDS)</Typography> */}
        </Typography>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupee color="primary" />
              </InputAdornment>
            ),
          }}
          name={"including_tds"}
          value={values.including_tds || ""}
          placeholder="Enter your difference here"
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
          disabled={isSubAdmin}
          fullWidth
          sx={
            {
              "& .MuiOutlinedInput-input": {
                color: "black",
              },
            }
          }
        />
      </Box>
      {/* <Box sx={{ my: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography component={"div"} sx={{ mb: 1 }}>
            Enter next month rate difference
            <Typography variant="caption">(With TCS)</Typography>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Show / Hide
            </Typography>
            <Switch 
              // disabled={isSubAdmin}
              checked={values.next_month_rate_status === 1}
              onChange={handleSwitchChange}
              name={"next_month_rate_status"}
            />
          </Box>
        </Box>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupee color="primary" />
              </InputAdornment>
            ),
          }}
          name={"next_including_tcs"}
          value={values.next_including_tcs || ""}
          placeholder="Enter your difference here"
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          type="number"
          disabled={isSubAdmin}
        />
      </Box> */}
      {/* <Box sx={{ my: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography component={"div"} sx={{ mb: 1 }}>
            Enter next month rate difference
            <Typography variant="caption">(With TDS)</Typography>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Show / Hide
            </Typography>
            <Switch
              // disabled={isSubAdmin}
              checked={values.next_month_rate_status === 1}
              onChange={handleSwitchChange}
              name={"next_month_rate_status"}
            />
          </Box>
        </Box>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupee color="primary" />
              </InputAdornment>
            ),
          }}
          name={"next_including_tds"}
          value={values.next_including_tds || ""}
          placeholder="Enter your difference here"
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
          disabled={isSubAdmin}
          fullWidth
        />
      </Box> */}

      {/* Silver TDS Start */}
      <Box sx={{ my: 2 }}>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Enter your rate SILVER difference
          {/* <Typography variant="caption">(With TDS)</Typography> */}
        </Typography>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupee color="primary" />
              </InputAdornment>
            ),
          }}
          name={"including_silver_tds"}
          value={values.including_silver_tds || ""}
          placeholder="Enter silver difference here"
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
          disabled={isSubAdmin}
          fullWidth
          sx={
            {
              "& .MuiOutlinedInput-input": {
                color: "black",
              },
            }
          }
        />
      </Box>

      {/* <Box sx={{ my: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography component={"div"} sx={{ mb: 1 }}>
            Enter next month rate difference for Silver
            <Typography variant="caption">(With TDS)</Typography>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Show / Hide
            </Typography>
            <Switch
              checked={values.next_month_silver_rate_status === 1}
              onChange={handleSilverSwitchChange}
              name={"next_month_silver_rate_status"}
            />
          </Box>
        </Box>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupee color="primary" />
              </InputAdornment>
            ),
          }}
          name={"next_month_silver_tds"}
          value={values.next_month_silver_tds || ""}
          placeholder="Enter silver difference here"
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
          disabled={isSubAdmin}
          fullWidth
        />
      </Box> */}
      {/* Silver TDS End */}
      <Box>
        <LoadingButton
          loading={isLoading}
          sx={{ color: "white" }}
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubAdmin}
        >
          Submit
        </LoadingButton>
      </Box>
    </Paper>
  );
}
