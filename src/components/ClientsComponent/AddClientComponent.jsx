import {
	Box,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputAdornment,
	InputLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import {
	Lock,
	Person,
	Timeline,
	CallRounded,
	AlternateEmail,
} from "@mui/icons-material";
import { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useLocation, useNavigate } from "react-router";
import { userForm } from "../../utils/ValidationSchema";
import { useAddClientsMutation, useUpdateClientsMutation } from "../../store";

export default function AddClientComponent() {
	const { state } = useLocation();
	const userData = state ? state.data : null;
	const [addClient, { isLoading, error }] = useAddClientsMutation();
	const [editClient, { isLoading: editing, error: editError }] =
		useUpdateClientsMutation();
	const navigate = useNavigate();
	const defaultFormFields = {
		email: "",
		password: "",
		name: "",
		mobile: "",
		// gender: "",
		opted_for: "tds",
		is_admin: 1,
		limit: "",
		silver_limit: "",
		client_id: "",
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
		validationSchema: userForm(userData?.id || false),
		enableReinitialize: true,
		onSubmit: (values) => handleFormSubmit(values),
	});
	const handleFormSubmit = async (values) => {
		try {
			if (!userData) {
				const res = await addClient(values);
				console.log("🚀 ~ handleFormSubmit ~ res:", res);
				if (res.data.code == 200) {
					toast.success("Client registered successfully");
					navigate(-1);
				}
			} else {
				const res = await editClient({ values, id: userData.id });
				if (res.data.code == 200) {
					toast.success("User updated successfully");
					navigate(-1);
				}
			}
		} catch (error) {
			console.log("🚀 ~ handleFormSubmit ~ error:", error);
			toast.error("Error while registering client");
		}
	};
	useEffect(() => {
		if (userData) {
			setValues({
				email: userData.email || "",
				name: userData.name,
				mobile: userData.mobile,
				// gender: userData.gender,
				// opted_for: (userData.opted_for == 'TCS' || userData.opted_for == 'tcs')? 'TCS' : 'TDS',	
				opted_for: 'TDS',
				limit: userData.limit,
				silver_limit: userData.silver_limit || "",
				client_id: userData.client_id,
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
	useEffect(() => {
		if (editError && editError !== undefined) {
			Object.keys(editError.data.errors).forEach((field) => {
				editError.data.errors[field].forEach((message) => {
					toast.error(`${message}`, { autoClose: false, theme: "colored" });
				});
			});
		}
	}, [editError]);
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
					{userData ? "Update" : "Add new"} user
				</Typography>
			</Box>
			<Paper sx={{ p: 3, borderRadius: "15px" }}>
				<form onSubmit={handleSubmit} autoComplete="off">
					<Box>
						<TextField
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
					{/* <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}> */}
					{/* <FormControl fullWidth>
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
						</FormControl> */}
					{/* <Box width={"100%"}>
							<FormControl
								onChange={handleChange}
								onBlur={handleBlur}
								fullWidth
							>
								<InputLabel>Opted for</InputLabel>
								<Select
									sx={{
										borderRadius: "30px",
										boxShadow: "1px 5px 3px #eaeaea",
									}}
									value={values.opted_for}
									label="Opted for"
									name="opted_for"
									onChange={handleChange}
								>
									<MenuItem value={"TCS"}>TCS</MenuItem>
									<MenuItem value={"TDS"}>TDS</MenuItem>
								</Select>
							</FormControl>
							{errors.opted_for && touched.opted_for ? (
								<Typography variant="caption" sx={{ color: "red" }}>
									{errors.opted_for}
								</Typography>
							) : null}
						</Box> */}
					{/* </Box> */}
					{errors.gender && touched.gender ? (
						<Typography variant="caption" sx={{ color: "red" }}>
							{errors.gender}
						</Typography>
					) : null}
					<Box
						sx={{
							mt: 3,
							display: "flex",
							alignItems: "center",
							gap: "5px",
							flexDirection: { xs: "column", sm: "row" },
						}}
					>
						<Box width={"100%"}>
							<TextField
								label="Client ID"
								onChange={handleChange}
								name="client_id"
								value={values.client_id}
								onBlur={handleBlur}
								placeholder="Enter client id"
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Person color="primary" />
										</InputAdornment>
									),
								}}
							/>
							{errors.client_id && touched.client_id ? (
								<Typography variant="caption" sx={{ color: "red" }}>
									{errors.client_id}
								</Typography>
							) : null}
						</Box>
						<Box sx={{ mt: { xs: 3, sm: 0 } }} width={"100%"}>
							<TextField
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
							{errors.password && touched.password ? (
								<Typography variant="caption" sx={{ color: "red" }}>
									{errors.password}
								</Typography>
							) : null}
						</Box>
					</Box>
					<TextField
						onChange={handleChange}
						value={values.limit}
						name="limit"
						label="Gold Limit"
						onBlur={handleBlur}
						placeholder="Enter gold limit"
						fullWidth
						sx={{ mt: 3 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Timeline color="primary" />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						onChange={handleChange}
						value={values.silver_limit}
						name="silver_limit"
						label="Silver Limit"
						onBlur={handleBlur}
						placeholder="Enter silver limit"
						fullWidth
						sx={{ mt: 3 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Timeline color="primary" />
								</InputAdornment>
							),
						}}
					/>
					<Box sx={{ mt: 3 }}>
						<LoadingButton
							loading={isLoading || editing}
							variant="contained"
							type="submit"
						>
							Save User
						</LoadingButton>
					</Box>
				</form>
			</Paper>
		</>
	);
}
