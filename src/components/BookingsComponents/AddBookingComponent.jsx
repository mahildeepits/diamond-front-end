import {
	Paper,
	TextField,
	Typography,
	Autocomplete,
	CircularProgress,
	Box,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	Grid2,
	Switch,
} from "@mui/material";
import dayjs from "dayjs";
import { useAddBookingMutation, useSearchClientsQuery } from "../../store";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { bookingsSchemaAdmin, bookingsSchemaNonAdmin } from "../../utils/ValidationSchema";
import useUserPermissions from "../../utils/useSubAdmin";
import LiveRateApi from "../../utils/LiveRateApi";
import { useSelector } from "react-redux";
import { useFetchDeliveryDatesQuery } from '../../store/apis/BookingsAPI'
import { useNavigate } from "react-router-dom";
import { useFetchBookingDatesQuery } from '../../store/apis/BookingsAPI'


export default function AddBookingComponent() {
	const activeUser = useSelector((state) => {
		return state.CurrentUser.user;
	});
	const navigate = useNavigate();
	const [dateOptions, setDateOptions] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [charges, setCharges] = useState(0);
	const [deliveryDatesData, setDeliveryDatesData] = useState(null);
	const [limit, setLimit] = useState('');
	const [balance, setBalance] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [metalType, setMetalType] = useState("gold"); // gold, silver, retail_gold
	const [selectedUser, setSelectedUser] = useState(null);
	const { isSubAdmin } = useUserPermissions();
	const { data: dates_data, isLoading: is_loading, error } = useFetchDeliveryDatesQuery();
	const [ranges, setRanges] = useState([]);
	const { data: rangeData, isLoading: is_range_loading, refetch } = useFetchBookingDatesQuery()
	useEffect(() => {
		if (deliveryDatesData == null && dates_data?.data?.length > 0) {
			setDeliveryDatesData(dates_data.data);
		}
	})
	const { data, isLoading, _, isFetching } = useSearchClientsQuery(
		{ searchText: searchText },
		{
			refetchOnMountOrArgChange: true,
		}
	);
	const [clientsData, setClientsData] = useState([]);
	const [addBooking, { isLoading: addingBooking }] = useAddBookingMutation();
	const [currentGoldRate, setCurrentGoldRate] = useState(0);
	const [currentSilverRate, setCurrentSilverRate] = useState(0);
	const [currentRetailGoldRate, setCurrentRetailGoldRate] = useState(0);
	useEffect(() => {
		if (data) {
			setClientsData(data?.users);
		}
	}, [data]);
	useEffect(() => {
		const targetUser = activeUser.is_admin == 0 ? activeUser : selectedUser;
		if (targetUser) {
			if (metalType === 'gold') {
				setBalance(targetUser.balance);
				setLimit(targetUser.limit);
			} else if (metalType === 'retail_gold') {
				setBalance(targetUser.retail_gold_balance);
				setLimit(targetUser.retail_gold_limit);
			} else {
				setBalance(targetUser.silver_balance);
				setLimit(targetUser.silver_limit);
			}
		}
	}, [activeUser, selectedUser, metalType]);
	useEffect(() => {
		if (rangeData) {
			setRanges(rangeData?.data);
		}
	}, [rangeData])
	useEffect(() => {
		if (deliveryDatesData) {
			let deliveryDatesArray = [
				{
					label: "Select Delivery Date",
					value: null,
					charges: 0,
				},
			];
			const currentDate = new Date();
			const chargesData = ranges;
			const maxToDay = Math.max(...chargesData.map((item) => item.to_day));

			for (let i = 0; i <= maxToDay; i++) {
				const date = new Date(currentDate);
				date.setDate(currentDate.getDate() + i);
				const monthNames = [
					"Jan", "Feb", "Mar", "Apr", "May", "Jun",
					"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				];
				const formattedDate = `${date.getDate()}-${monthNames[date.getMonth()]}-${date.getFullYear()}`;

				let currentCharges = 0;
				for (const range of chargesData) {
					if ((!range.type || range.type === (metalType === 'retail_gold' ? 'gold' : metalType)) && i >= range.from_day && i <= range.to_day) {
						currentCharges = (metalType === 'gold' || metalType === 'retail_gold') ? range.charges / 10 : range.charges / 1000;
						break;
					}
				}
				deliveryDatesArray.push({
					label: `${formattedDate} (₹${((metalType === 'gold' || metalType === 'retail_gold') ? currentCharges * 1 : currentCharges * 1000).toFixed(0)}/${(metalType === 'gold' || metalType === 'retail_gold') ? 'gm' : 'kg'} Extra Charges)`,
					value: formattedDate,
					charges: currentCharges,
				});
			}
			setDateOptions(deliveryDatesArray);
		}
	}, [deliveryDatesData, ranges, metalType]);
	useEffect(() => {
		if (selectedDate) {
			const selectedOption = dateOptions.find((date) => date.value === selectedDate);
			setCharges(selectedOption ? selectedOption.charges : 0);
		}
	}, [selectedDate, dateOptions]);
	useEffect(() => {
		const interval = setInterval(async () => {
			const apiRes = await LiveRateApi.fetch();
			if (apiRes) {
				setCurrentGoldRate(apiRes.includingTds / 10);
				setCurrentRetailGoldRate(apiRes.retailGoldRate / 10);
				const sRate = apiRes.silverPrice || apiRes.silverRate || 0;
				setCurrentSilverRate((apiRes.silverCostHigh || sRate) / 1000);
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);
	const handleSearchString = (e, value, reason) => {
		setSearchText(value);
	};
	const formik = useFormik({
		initialValues: {
			client_id: "",
			rate: metalType === 'gold' ? currentGoldRate : currentSilverRate,
			quantity: 0,
			total_amount: 0,
			byType: "quantity",
			remarks: "",
			rateOption: "current",
			is_pending_order: 0,
			type: metalType,
		},
		validationSchema: (activeUser.is_admin == 1) ? bookingsSchemaAdmin : bookingsSchemaNonAdmin,
		onSubmit: (values) => {
			// Log form values and errors for debugging
			console.log("Form submitted with values:", values);
			console.log("Formik errors at submit:", formik.errors);

			handleFormSubmit(values);
		},
	});
	const handleFormSubmit = async (values) => {
		console.log("handleFormSubmit triggered!"); // Debugging log
		try {
			const bookingData = {
				client_id: activeUser.is_admin == 0 ? activeUser.id : values.client_id,
				quantity_or_amount: values.byType == "quantity" ? 0 : 1,
				rate: values.rateOption === "current" ? (metalType === 'gold' ? currentGoldRate : (metalType === 'retail_gold' ? currentRetailGoldRate : currentSilverRate)) : ((metalType === 'gold' || metalType === 'retail_gold') ? values.rate / 10 : values.rate / 1000),
				remarks: values.remarks,
				created_by: activeUser.is_admin == 1 ? "admin" : activeUser.id,
				delivery_date: selectedDate, // Added field
				delivery_charges: (charges > 0 && values.byType === 'quantity') ? charges * (metalType === 'silver' ? values.quantity * 1000 : values.quantity) : 0,
				is_pending_order: values.is_pending_order,
				type: metalType,
			};
			if (values.byType === "quantity") {
				bookingData.quantity = metalType === 'silver' ? values.quantity * 1000 : values.quantity;
				bookingData.total_amount = bookingData.quantity * bookingData.rate;
			} else {
				bookingData.delivery_charges = (charges > 0 && bookingData.rate) ? Math.floor((values.total_amount / bookingData.rate) * (charges * (metalType === 'silver' ? 1000 : 1))) : 0;
				bookingData.total_amount = values.total_amount;
			}

			console.log("Submitting data:", bookingData); // Debugging log

			const res = await addBooking(bookingData);
			if (res.data && res.data.code === 200) {
				toast.success("Booking added successfully");
				formik.resetForm();
				setTimeout(() => {
					// window.location.reload();
					navigate('/bookings')
				}, 500);
			} else if (res.error?.data?.code === 400) {
				console.log("Error response:", res.error); // Debugging log
				toast.error(res.error.data.message);
			}
		} catch (error) {
			console.log("🚀 ~ onSubmit: ~ error:", error);
			toast.error("Error while adding booking");
		}
	};

	return (
		<>

			<Paper sx={{ p: { xs: 2, sm: 2, md: 3, mt: 3 }, borderRadius: "15px", margin: "1rem" }}>

				<form onSubmit={(e) => {
					e.preventDefault();
					console.log("Formik handleSubmit called!"); // Debug here
					formik.handleSubmit(e);
				}}>
					<Grid2 container alignItems="center" justifyContent="space-between">
						{/* Heading */}
						<Grid2 item>
							<Typography variant="h6" sx={{ fontWeight: "bold", color: "#001C76" }}>
								Add Booking for your client
							</Typography>
						</Grid2>

						{/* Metal Selection */}
						<Grid2 item>
							<Box sx={{ display: 'flex', gap: 1, backgroundColor: '#f0f0f0', p: 0.5, borderRadius: '8px' }}>
								<Box
									onClick={() => {
										setMetalType('gold')
										formik.setFieldValue('type', 'gold')
										formik.setFieldValue('rate', currentGoldRate)
									}}
									sx={{
										px: 2, py: 0.8, borderRadius: '6px', cursor: 'pointer',
										backgroundColor: metalType === 'gold' ? '#FFD700' : 'transparent',
										color: metalType === 'gold' ? '#000' : '#888',
										fontSize: '13px',
										fontWeight: 'bold', transition: '0.3s'
									}}
								>
									Gold
								</Box>
								<Box
									onClick={() => {
										setMetalType('retail_gold')
										formik.setFieldValue('type', 'retail_gold')
										formik.setFieldValue('rate', currentRetailGoldRate)
									}}
									sx={{
										px: 2, py: 0.8, borderRadius: '6px', cursor: 'pointer',
										backgroundColor: metalType === 'retail_gold' ? '#ff9933' : 'transparent',
										color: metalType === 'retail_gold' ? '#000' : '#888',
										fontSize: '13px',
										fontWeight: 'bold', transition: '0.3s'
									}}
								>
									Retail
								</Box>
								<Box
									onClick={() => {
										setMetalType('silver')
										formik.setFieldValue('type', 'silver')
										formik.setFieldValue('rate', currentSilverRate)
									}}
									sx={{
										px: 2, py: 0.8, borderRadius: '6px', cursor: 'pointer',
										backgroundColor: metalType === 'silver' ? '#C0C0C0' : 'transparent',
										color: metalType === 'silver' ? '#000' : '#888',
										fontSize: '13px',
										fontWeight: 'bold', transition: '0.3s'
									}}
								>
									Silver
								</Box>
							</Box>
						</Grid2>

						{/* Pending Order Switch */}
						<Grid2 item>
							<FormControlLabel
								control={
									<Switch
										checked={formik.values.is_pending_order === 1}
										onChange={(event) =>
											formik.setFieldValue("is_pending_order", event.target.checked ? 1 : 0)
										}
									/>
								}
								label={"Is Pending Order"}
							/>
						</Grid2>
					</Grid2>
					<Grid2 container spacing={2}>
						<Grid2 item size={{ xs: 12, md: 6 }} hidden={(activeUser.is_admin == 1 ? false : true)}>
							<Typography sx={{ my: 1 }}>Booking for</Typography>
							<Autocomplete
								disabled={isSubAdmin}
								disablePortal
								options={clientsData}
								loading={isLoading || isFetching}
								sx={{ width: "100%" }}
								onChange={(_, value) => {
									console.log(value);
									setSelectedUser(value);
									formik.setFieldValue("client_id", value?.id);
								}
								}
								onInputChange={handleSearchString}
								renderInput={(params) => (
									<TextField
										{...params}
										error={
											formik.touched.client_id &&
											Boolean(formik.errors.client_id)
										}
										helperText={
											formik.touched.client_id && formik.errors.client_id
										}
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<>
													{isLoading ? (
														<CircularProgress color="inherit" size={20} />
													) : null}
													{params.InputProps.endAdornment}
												</>
											),
										}}
										placeholder={"Search for client"}
									/>
								)}
								getOptionLabel={(option) => option.name}
							/>
						</Grid2>
						<Grid2 item size={{ xs: 12, md: (activeUser.is_admin == 1 ? 6 : 12) }}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
								<Typography>{(metalType === 'gold' || metalType === 'retail_gold') ? (metalType === 'retail_gold' ? 'Retail Gold ' : 'Gold ') : 'Silver '}Balance</Typography>
								<Typography sx={{ ml: 2, color: 'text.secondary' }}>Total {(metalType === 'gold' || metalType === 'retail_gold') ? (metalType === 'retail_gold' ? 'Retail Gold ' : 'Gold ') : 'Silver '}Limit: {limit}</Typography>
							</Box>
							<TextField disabled value={balance} fullWidth />
						</Grid2>
					</Grid2>
					<Grid2 container spacing={2} sx={{ mt: 1 }}>
						<Grid2 item size={{ xs: 12, md: 6 }}>

							{activeUser.is_admin == 1 ? (
								<FormControl>
									<RadioGroup
										value={formik.values.rateOption}
										onChange={(e) =>
											formik.setFieldValue("rateOption", e.target.value)
										}
										row
										name="rateOption"
									>
										<FormControlLabel
											value="current"
											control={<Radio />}
											label="Current rate"
										/>
										<FormControlLabel
											value="manual"
											control={<Radio />}
											label="Manually"
										/>
									</RadioGroup>
								</FormControl>
							) : (
								<Typography sx={{ my: 1.2 }}>Current Rate</Typography>
							)}
							{activeUser.is_admin == 1 ? (
								formik.values.rateOption === "current" ? (
									<TextField
										disabled
										sx={{ mt: 1 }}
										value={metalType === 'gold' ? currentGoldRate * 10 : (metalType === 'retail_gold' ? currentRetailGoldRate * 10 : currentSilverRate * 1000)}
										fullWidth
										name="rate"
									/>
								) : (
									<TextField
										disabled={isSubAdmin}
										placeholder="Enter rate"
										type="number"
										name="rate"
										value={formik.values.rate}
										fullWidth
										sx={{ mt: 1 }}
										onChange={formik.handleChange}
										error={formik.touched.rate && Boolean(formik.errors.rate)}
										helperText={formik.touched.rate && formik.errors.rate}
									/>
								)
							) : (
								<TextField
									disabled
									placeholder="Enter rate"
									type="number"
									name="rate"
									value={metalType === 'gold' ? currentGoldRate : (metalType === 'retail_gold' ? currentRetailGoldRate : currentSilverRate)}
									fullWidth
									sx={{ mt: 1 }}
									onChange={formik.handleChange}
									error={formik.touched.rate && Boolean(formik.errors.rate)}
									helperText={formik.touched.rate && formik.errors.rate}
								/>
							)
							}
						</Grid2>
						<Grid2 item size={{ xs: 12, md: 6 }}>
							<FormControl>
								<RadioGroup
									value={formik.values.byType}
									onChange={(e) =>
										formik.setFieldValue("byType", e.target.value)
									}
									row
									name="byType"
								>
									<FormControlLabel
										value="quantity"
										control={<Radio />}
										label="By Quantity"
									/>
									<FormControlLabel value="amount" control={<Radio />} label="By Amount" />
								</RadioGroup>
							</FormControl>
							{formik.values.byType === "quantity" ? (
								<Autocomplete
									disabled={isSubAdmin}
									sx={{ mt: 1 }}
									options={(metalType === 'gold' || metalType === 'retail_gold')
										? Array.from({ length: 49 }, (_, i) => 20 + i * 10)
										: [5, 10, 15, 20, 25, 30]
									}
									getOptionLabel={(option) => `${option} ${(metalType === 'gold' || metalType === 'retail_gold') ? 'gms' : 'kg'}`}
									value={formik.values.quantity || null}
									onChange={(_, value) => formik.setFieldValue("quantity", value)}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder={`Select ${(metalType === 'gold' || metalType === 'retail_gold') ? 'Grams' : 'KG'}`}
											error={formik.touched.quantity && Boolean(formik.errors.quantity)}
											helperText={formik.touched.quantity && formik.errors.quantity}
										/>
									)}
								/>
							) : (
								<TextField
									disabled={isSubAdmin}
									type="number"
									placeholder="Enter amount"
									fullWidth
									value={formik.values.total_amount}
									sx={{ mt: 1 }}
									onChange={formik.handleChange}
									name="total_amount"
									error={formik.touched.total_amount && Boolean(formik.errors.total_amount)}
									helperText={formik.touched.total_amount && formik.errors.total_amount}
								/>
							)}
						</Grid2>
					</Grid2>
					<Box sx={{ mt: 2 }}>
						<Typography variant="subtitle1" sx={{ mt: 2 }}>
							Delivery Date & Charges
						</Typography>
						<Autocomplete
							sx={{ mt: 1 }}
							options={dateOptions}
							value={dateOptions.find((o) => o.value === selectedDate) || null}
							getOptionLabel={(o) => o.label}
							onChange={(_, v) => {
								setSelectedDate(v ? v.value : null)
							}}
							renderInput={(params) => <TextField {...params} placeholder="Select Date" />}
						/>
					</Box>
					{/* <Grid2 container spacing={1} sx={{ mt: 1 }}>
							<Grid2 item> */}

					{/* </Grid2>
						</Grid2> */}
					<Typography variant="subtitle1" sx={{ mt: 2 }}>
						Remarks
					</Typography>
					<TextField
						disabled={isSubAdmin}
						value={formik.values.remarks}
						placeholder="Write remarks"
						fullWidth
						onChange={formik.handleChange}
						name="remarks"
					/>
					<Box sx={{ textAlign: "right", mt: 3 }}>
						<LoadingButton
							loading={addingBooking}
							variant="contained"
							type="submit"
							onClick={() => console.log("Book Now button clicked!")}
						>
							Book now
						</LoadingButton>
					</Box>
				</form>
			</Paper>
		</>
	);
}
