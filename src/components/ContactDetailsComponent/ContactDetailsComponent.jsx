/* eslint-disable react/prop-types */
import {
  AlternateEmail,
  BusinessRounded,
  CallRounded,
  ContactPhoneRounded,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Paper, InputAdornment, Typography } from "@mui/material";
import { useAddAdminContactDetailsMutation } from "../../store";
import useUserPermissions from "../../utils/useSubAdmin";
import { useSelector } from "react-redux";
export default function ContactDetailsComponent({ contactDetails }) {
  const { isSubAdmin } = useUserPermissions();
  const userDetails = useSelector(state => state.CurrentUser.user);
  const isAdmin = userDetails.is_admin === 1 ? true : false;

  const [addClientContactDetails, { isLoading }] =
    useAddAdminContactDetailsMutation();
  const formik = useFormik({
    initialValues: {
      first_contact_number: contactDetails?.first_contact_number || "",
      first_booking_number: contactDetails?.second_contact_number || "",
      email: contactDetails?.email || "",
      address: contactDetails?.address || "",
      gst_no: contactDetails?.gst_no || "",
    },
    enableReinitialize: true,
    // validationSchema: bankDetailsSchema,
    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });
  const handleFormSubmit = async () => {
    try {
      const res = await addClientContactDetails(formik.values);
      if (res.data.code == 200) {
        toast.success("Details added successfully");
      }
    } catch (error) {
      toast.error("Error while adding details");
    }
  };

  return !isAdmin ? (
    <Paper elevation={3} sx={{ padding: 2, borderRadius: "15px", bgcolor: "white", color: "black" }}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="pageHeading">Our Address</Typography>
        <Typography variant="body1" padding={".4rem 1rem"}>{contactDetails?.address}</Typography>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="pageHeading">Contacts Numbers</Typography>
        <Typography variant="body1" padding={".4rem 1rem"}>{contactDetails?.first_contact_number}, {contactDetails?.first_booking_number} </Typography>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="pageHeading">GST No</Typography>
        <Typography variant="body1" padding={".4rem 1rem"}>{contactDetails?.gst_no}</Typography>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="pageHeading">Email Address</Typography>
        <Typography variant="body1" padding={".4rem 1rem"}>{contactDetails?.email}</Typography>
      </Box>

    </Paper>
  ) : (
    <Paper elevation={3} sx={{
      padding: 2,
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
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Box
          sx={{
            display: "flex",
            flexDirection: { sm: "row", xs: "column" },
            alignItems: "center",
            gap: { sm: "20px", xs: 0 },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ContactPhoneRounded color="primary" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter contact number 1"
              label="Contact Number"
              name="first_contact_number"
              value={formik.values.first_contact_number}
              onChange={formik.handleChange}
              disabled={isSubAdmin}
              onBlur={formik.handleBlur}
              error={
                formik.touched.first_contact_number &&
                Boolean(formik.errors.first_contact_number)
              }
              helperText={
                formik.touched.first_contact_number &&
                formik.errors.first_contact_number
              }
              fullWidth
              type="number"
              sx={
                {
                  my: 2,
                  "& .MuiOutlinedInput-input": {
                    color: "black",
                  },
                }
              }
            />{" "}
            <TextField
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ContactPhoneRounded color="primary" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter contact number 2"
              type="number"
              label="Account Mng. Number"
              name="second_contact_number"
              value={formik.values.second_contact_number}
              onChange={formik.handleChange}
              disabled={isSubAdmin}
              onBlur={formik.handleBlur}
              error={
                formik.touched.second_contact_number &&
                Boolean(formik.errors.second_contact_number)
              }
              helperText={
                formik.touched.second_contact_number &&
                formik.errors.second_contact_number
              }
              fullWidth
              sx={
                {
                  my: 2,
                  "& .MuiOutlinedInput-input": {
                    color: "black",
                  },
                }
              }
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessRounded color="primary" />
                  </InputAdornment>
                ),
              }}
              label="GST No"
              name="gst_no"
              placeholder="Enter GST number"
              value={formik.values.gst_no}
              onChange={formik.handleChange}
              disabled={isSubAdmin}
              onBlur={formik.handleBlur}
              error={
                formik.touched.gst_no &&
                Boolean(formik.errors.gst_no)
              }
              helperText={
                formik.touched.gst_no &&
                formik.errors.gst_no
              }
              fullWidth
              sx={
                {
                  my: 2,
                  "& .MuiOutlinedInput-input": {
                    color: "black",
                  },
                }
              }
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", sm: "column", xs: "column" },
            alignItems: "center",
            gap: { md: "20px", xs: 0, sm: 0 },
          }}
        >
          <Box width={"100%"}>
            {" "}
            <TextField
              margin="normal"
              placeholder="Enter your email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail color="primary" />
                  </InputAdornment>
                ),
              }}
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              disabled={isSubAdmin}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
              sx={
                {
                  my: 2,
                  "& .MuiOutlinedInput-input": {
                    color: "black",
                  },
                }
              }
            />
          </Box>
          <Box width={"100%"}>
            {" "}
            <TextField
              margin="normal"
              placeholder="Enter your address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessRounded color="primary" />
                  </InputAdornment>
                ),
              }}
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              disabled={isSubAdmin}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              fullWidth
              sx={
                {
                  my: 2,
                  "& .MuiOutlinedInput-input": {
                    color: "black",
                  },
                }
              }
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isSubAdmin}
          >
            Save
          </LoadingButton>
        </Box>
      </form>
    </Paper>
  );
}
