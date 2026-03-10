/* eslint-disable react/prop-types */
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LoadingButton } from "@mui/lab";
import { useRef, useState } from "react";
import { Home, Lock, Person } from "@mui/icons-material";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { loginSchema } from "../../utils/ValidationSchema";
import { useDispatch } from "react-redux";
import { setAccessToken, setCurrentUser } from "../../store";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../../utils/errorParser";

export default function LoginComponent({ variant }) {
  const toastId = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const defaultFormFields = {
    email: "",
    password: "",
  };
  const { values, touched, errors, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: defaultFormFields,
      validationSchema: loginSchema,
      enableReinitialize: true,
      onSubmit: (values) => handleFormSubmit(values),
    });
  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      toastId.current = toast.loading("Logging in...", {
        position: "top-center",
        theme: "colored",
      });
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/login`,
        values,
      );
      if (response.data.code == 201 || response.data.code == 200) {
        const user = response.data.data.user;
        const token = response.data.data.token;
        dispatch(setCurrentUser(user));
        dispatch(setAccessToken(token));
        toast.update(toastId.current, {
          render: "Logged in successfully",
          type: "success",
          isLoading: false,
          theme: "colored",
          duration: 1000,
          position: "top-center",
          closeOnClick: true,
          autoClose: true,
        });
        navigate("/");
      } else {
        throw response;
      }
    } catch (error) {
      toast.update(toastId.current, {
        render: getErrorMessage(error, "Login failed. Please check credentials."),
        type: "error",
        isLoading: false,
        theme: "colored",
        duration: 2000,
        position: "top-center",
        closeOnClick: true,
        autoClose: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={{ py: 5 }}>
      <motion.div variants={variant} initial="hidden" animate="visible">
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box>
            <TextField
              error={errors.email ? true : false}
              onChange={handleChange}
              value={values.email}
              name="email"
              onBlur={handleBlur}
              placeholder="Email or Client ID"
              fullWidth
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  padding: "4px 8px",
                  transition: "all 0.3s ease",
                  "&.Mui-focused": {
                    borderColor: "#eebb2e",
                    background: "rgba(255, 255, 255, 0.1)",
                  }
                },
                "& .MuiOutlinedInput-root": {
                  boxShadow: "none!important"
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none"
                },
                "& .MuiInputBase-input": {
                  color: "#fff",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.4)",
                  opacity: 1
                },
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                  WebkitTextFillColor: "#fff",
                  WebkitTransition: "color 9999s ease-out, background-color 9999s ease-out",
                  WebkitTransitionDelay: "9999s",
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#fff', opacity: 0.7 }} />
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
          <Box sx={{ mt: 5 }}>
            <TextField
              error={errors.password ? true : false}
              type="password"
              onChange={handleChange}
              name="password"
              value={values.password}
              onBlur={handleBlur}
              placeholder="Password"
              fullWidth
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  padding: "4px 8px",
                  transition: "all 0.3s ease",
                  "&.Mui-focused": {
                    borderColor: "#eebb2e",
                    background: "rgba(255, 255, 255, 0.1)",
                  }
                },
                "& .MuiOutlinedInput-root": {
                  boxShadow: "none!important"
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none"
                },
                "& .MuiInputBase-input": {
                  color: "#fff",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.4)",
                  opacity: 1
                },
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                  WebkitTextFillColor: "#fff",
                  WebkitTransition: "color 9999s ease-out, background-color 9999s ease-out",
                  WebkitTransitionDelay: "9999s",
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#fff', opacity: 0.7 }} />
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
          <Box sx={{ mb: 5, mt: 1, textAlign: "right" }}>
            <Typography sx={{ color: '#d1a14a', cursor: 'pointer' }} variant="bold">
              Forgot Password?
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box width={"100%"}>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                sx={{
                  background: "linear-gradient(180deg, #895c00 0%, #f2ddae 100%)",
                  color: "#2c1e05",
                  fontWeight: 700,
                  fontSize: "16px",
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 4px 15px rgba(137, 92, 0, 0.4)",
                  "&:hover": { background: "linear-gradient(180deg, #9a6800 0%, #fcecba 100%)" },
                  width: "100%"
                }}
                type="submit"
              >
                Sign In
              </LoadingButton>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "#fff", textAlign: "center", mt: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }} onClick={() => navigate('/')}>
              Back to Home <Home sx={{ color: '#d1a14a', cursor: 'pointer' }} />
            </Typography>
          </Box>
        </form>
      </motion.div>
    </Box>
  );
}
