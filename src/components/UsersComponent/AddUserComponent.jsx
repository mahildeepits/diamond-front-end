import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { subAdminSchema } from "../../utils/ValidationSchema";
import { useFormik } from "formik";
import { AlternateEmail, CallRounded, Lock, Person } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useAddClientsMutation } from "../../store";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import {
  ClientsAPI,
  useUpdateClientsMutation,
} from "../../store/apis/ClientsAPI";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { AdminAPI } from "../../store/apis/AdminAPI";

export default function AddUserComponent() {
  const { state } = useLocation();
  const [addClient, { isLoading, error }] = useAddClientsMutation();
  const [editUser, { isLoading: updatingClient }] = useUpdateClientsMutation();
  const userData = state ? state.data : null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const defaultFormFields = {
    email: "",
    password: "",
    name: "",
    mobile: "",
    // gender: "",
    is_subadmin: 1,
  };
  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: defaultFormFields,
    validationSchema: subAdminSchema,
    enableReinitialize: true,
    onSubmit: (values) => handleFormSubmit(values),
  });
  const handleFormSubmit = async (values) => {
    try {
      if (!userData) {
        const res = await addClient(values);
        if (res.data.code == 200) {
          toast.success("User registered successfully");
          navigate(-1);
          dispatch(ClientsAPI.util.resetApiState());
          dispatch(AdminAPI.util.resetApiState());
        }
      } else {
        const res = await editUser({ values, id: userData.id });
        if (res.data.code == 200) {
          toast.success("User updated successfully");
          navigate(-1);
          dispatch(AdminAPI.util.resetApiState());
          dispatch(ClientsAPI.util.resetApiState());
        }
      }
    } catch (error) {
      console.log("🚀 ~ handleFormSubmit ~ error:", error);
    }
  };
  useEffect(() => {
    if (userData) {
      setValues({
        email: userData.email,
        name: userData.name,
        mobile: userData.mobile,
        // gender: userData.gender,
        is_subadmin: 1,
      });
    }
  }, [userData]);
  useEffect(() => {
    if (error && error !== undefined) {
      Object.keys(error.data.errors).forEach((field) => {
        error.data.errors[field].forEach((message) => {
          toast.error(`${message}`, { autoClose: false, theme: "colored" });
        });
      });
    }
  }, [error]);
  return (
    <>
      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">
          {userData ? "Edit" : "Add new"} user
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box>
            <TextField
              error={errors.name ? true : false}
              onChange={handleChange}
              value={values.name}
              name="name"
              label="Name"
              onBlur={handleBlur}
              placeholder="Enter name"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            {errors.name && touched.name ? (
              <Typography variant="caption" sx={{ color: "red" }}>
                {errors.name}
              </Typography>
            ) : null}
          </Box>
          <Box sx={{ mt: 4 }}>
            <TextField
              error={errors.email ? true : false}
              onChange={handleChange}
              value={values.email}
              name="email"
              label="Email"
              onBlur={handleBlur}
              placeholder="Enter email"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {errors.email && touched.email ? (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.email}
            </Typography>
          ) : null}
          <Box sx={{ mt: 4 }}>
            <TextField
              error={errors.mobile ? true : false}
              onChange={handleChange}
              value={values.mobile}
              name="mobile"
              label="Phone"
              onBlur={handleBlur}
              placeholder="Enter phone"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CallRounded color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {errors.mobile && touched.mobile ? (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.mobile}
            </Typography>
          ) : null}
          {/* <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
            <FormControl fullWidth>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                value={values.gender}
                onChange={handleChange}
                row
                name="gender"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>
          </Box> */}
          {errors.gender && touched.gender ? (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.gender}
            </Typography>
          ) : null}
          <Box sx={{ mt: 3 }}>
            <TextField
              error={errors.password ? true : false}
              type="password"
              label="Password"
              onChange={handleChange}
              name="password"
              value={values.password}
              onBlur={handleBlur}
              placeholder="Enter password"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {errors.password && touched.password ? (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.password}
            </Typography>
          ) : null}
          <Box sx={{ mt: 3 }}>
            <LoadingButton
              loading={isLoading || updatingClient}
              variant="contained"
              type="submit"
            >
              {userData ? "Update User" : "Save User"}
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </>
  );
}
