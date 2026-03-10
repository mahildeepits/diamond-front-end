/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  TextField,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import { bankDetailsSchema } from "../../utils/ValidationSchema";
import { LoadingButton } from "@mui/lab";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import {
  AccountCircleRounded,
  BarChartRounded,
  PasswordRounded,
} from "@mui/icons-material";
import useUserPermissions from "../../utils/useSubAdmin";
function BankDetailsFormComponent({
  bank = {},
  isNew,
  onSave,
  isAdding,
  id,
  setOpenDelete,
  isDisabled,
}) {
  const { isSubAdmin } = useUserPermissions();
  const formik = useFormik({
    initialValues: {
      bank_name: bank.bank_name || "",
      account_number: bank.account_number || "",
      ifsc_code: bank.ifsc_code || "",
      branch_name: bank.branch_name || "",
      account_holder_name: bank.account_holder_name || "",
    },
    enableReinitialize: true,
    validationSchema: bankDetailsSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });
  const handleOpenDelete = () => {
    setOpenDelete(id);
  };
  return isDisabled ? (<>
    <Paper elevation={3} sx={{ padding: 2, borderRadius: "15px", bgcolor: "white", color: "black" }}>
      <Box>
        <Box>
          <Typography variant="body1">Bank: </Typography>
          <Typography variant="h5" style={{ padding: "10px" }}>{bank.bank_name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">Account Number:</Typography>
          <Typography variant="h5" style={{ padding: "10px" }}>{bank.account_number}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">IFSC Code:</Typography>
          <Typography variant="h5" style={{ padding: "10px" }}>{bank.ifsc_code}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">Branch Name:</Typography>
          <Typography variant="h5" style={{ padding: "10px" }}>{bank.branch_name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">Account Holder Name:</Typography>
          <Typography variant="h5" style={{ padding: "10px" }}>{bank.account_holder_name}</Typography>
        </Box>
      </Box>
    </Paper>
  </>) : (
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
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="subtitle2">
          {isNew ? "Add New Bank" : `Bank: ${formik.values.bank_name}`}
        </Typography>
        <Box>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceRoundedIcon color="primary" />
                </InputAdornment>
              ),
            }}
            label="Bank Name"
            name="bank_name"
            value={formik.values.bank_name}
            onChange={formik.handleChange}
            disabled={isSubAdmin}
            onBlur={formik.handleBlur}
            error={formik.touched.bank_name && Boolean(formik.errors.bank_name)}
            helperText={formik.touched.bank_name && formik.errors.bank_name}
            fullWidth
            margin="normal"
            sx={
              {
                "& .MuiOutlinedInput-input": {
                  color: "black",
                },
              }
            }
          />
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordRounded color="primary" />
                </InputAdornment>
              ),
            }}
            label="Account Number"
            name="account_number"
            type="number"
            value={formik.values.account_number}
            onChange={formik.handleChange}
            disabled={isSubAdmin}
            onBlur={formik.handleBlur}
            error={
              formik.touched.account_number &&
              Boolean(formik.errors.account_number)
            }
            helperText={
              formik.touched.account_number && formik.errors.account_number
            }
            fullWidth
            margin="normal"
            sx={
              {
                "& .MuiOutlinedInput-input": {
                  color: "black",
                },
              }
            }
          />
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BarChartRounded color="primary" />
                </InputAdornment>
              ),
            }}
            label="IFSC Code"
            name="ifsc_code"
            value={formik.values.ifsc_code}
            onChange={formik.handleChange}
            disabled={isSubAdmin}
            onBlur={formik.handleBlur}
            error={formik.touched.ifsc_code && Boolean(formik.errors.ifsc_code)}
            helperText={formik.touched.ifsc_code && formik.errors.ifsc_code}
            fullWidth
            margin="normal"
            sx={
              {
                "& .MuiOutlinedInput-input": {
                  color: "black",
                },
              }
            }
          />
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceRoundedIcon color="primary" />
                </InputAdornment>
              ),
            }}
            label="Branch Name"
            name="branch_name"
            value={formik.values.branch_name}
            onChange={formik.handleChange}
            disabled={isSubAdmin}
            onBlur={formik.handleBlur}
            error={
              formik.touched.branch_name && Boolean(formik.errors.branch_name)
            }
            helperText={formik.touched.branch_name && formik.errors.branch_name}
            fullWidth
            margin="normal"
            sx={
              {
                "& .MuiOutlinedInput-input": {
                  color: "black",
                },
              }
            }
          />
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleRounded color="primary" />
                </InputAdornment>
              ),
            }}
            label="Account Holder Name"
            name="account_holder_name"
            value={formik.values.account_holder_name}
            onChange={formik.handleChange}
            disabled={isSubAdmin}
            onBlur={formik.handleBlur}
            error={
              formik.touched.account_holder_name &&
              Boolean(formik.errors.account_holder_name)
            }
            helperText={
              formik.touched.account_holder_name &&
              formik.errors.account_holder_name
            }
            fullWidth
            margin="normal"
            sx={
              {
                "& .MuiOutlinedInput-input": {
                  color: "black",
                },
              }
            }
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LoadingButton
              loading={isAdding}
              type="submit"
              disabled={isSubAdmin}
              variant="contained"
              sx={{ mt: 2 }}
            >
              {isNew ? "Add Bank" : "Update Bank"}
            </LoadingButton>
            {!isNew ? (
              <LoadingButton
                loading={isAdding}
                variant="outlined"
                color="red"
                disabled={isSubAdmin}
                sx={{ mt: 2, color: "red" }}
                onClick={handleOpenDelete}
              >
                Delete Bank
              </LoadingButton>
            ) : null}
          </Box>
        </Box>
      </form>
    </Paper>
  );
}

export default BankDetailsFormComponent;
