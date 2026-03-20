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
} from "@mui/material"
import dayjs from "dayjs"
import { useUpdateBookingMutation, useSearchClientsQuery, useFetchSingleBookingQuery } from "../../store"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { LoadingButton } from "@mui/lab"
import { useFormik } from "formik"
import { bookingsSchemaAdmin, bookingsSchemaNonAdmin } from "../../utils/ValidationSchema"
import useUserPermissions from "../../utils/useSubAdmin"
import LiveRateApi from "../../utils/LiveRateApi"
import { useSelector } from "react-redux"
import { useFetchDeliveryDatesQuery } from "../../store/apis/BookingsAPI"
import { useNavigate, useParams } from "react-router-dom"
import { useFetchBookingDatesQuery } from '../../store/apis/BookingsAPI'

export default function EditBookingComponent() {
  const { bookingId } = useParams()
  console.log(bookingId);
  const activeUser = useSelector((state) => {
    return state.CurrentUser.user
  })
  const navigate = useNavigate()
  const [dateOptions, setDateOptions] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [charges, setCharges] = useState(0)
  const [deliveryDatesData, setDeliveryDatesData] = useState(null)
  const [limit, setLimit] = useState("")
  const [balance, setBalance] = useState(0)
  const [searchText, setSearchText] = useState("")
  const [metalType, setMetalType] = useState("gold")
  const [isPastDate, setIsPastDate] = useState(false)
  const { isSubAdmin } = useUserPermissions()
  const { data: dates_data, isLoading: is_loading, error } = useFetchDeliveryDatesQuery()
  const { data: bookingData, isLoading: isBookingLoading } = useFetchSingleBookingQuery(parseInt(bookingId));

  useEffect(() => {
    if (deliveryDatesData == null && dates_data?.data?.length > 0) {
      setDeliveryDatesData(dates_data.data)
    }
  }, [deliveryDatesData, dates_data])

  const { data, isLoading, _, isFetching } = useSearchClientsQuery(
    { searchText: searchText },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const [clientsData, setClientsData] = useState([])
  const [updateBooking, { isLoading: updatingBooking }] = useUpdateBookingMutation()
  const [currentGoldRate, setCurrentGoldRate] = useState(0)
  const [currentSilverRate, setCurrentSilverRate] = useState(0)
  const [currentRetailGoldRate, setCurrentRetailGoldRate] = useState(0)
  const [selectedClient, setSelectedClient] = useState(null)

  const [ranges, setRanges] = useState([]);
  const { data: rangeData, isLoading: is_range_loading, refetch } = useFetchBookingDatesQuery()
  useEffect(() => {
    if (data) {
      setClientsData(data?.users)
    }
  }, [data])
  useEffect(() => {
    if (rangeData) {
      setRanges(rangeData?.data);
    }
  }, [rangeData])
  useEffect(() => {
    const targetUser = activeUser.is_admin == 0 ? activeUser : selectedClient
    if (targetUser) {
      if (metalType === 'gold') {
        setBalance(targetUser.balance)
        setLimit(targetUser.limit)
      } else if (metalType === 'retail_gold') {
        setBalance(targetUser.retail_gold_balance)
        setLimit(targetUser.retail_gold_limit)
      } else {
        setBalance(targetUser.silver_balance)
        setLimit(targetUser.silver_limit)
      }
    }
  }, [activeUser, selectedClient, metalType])

  useEffect(() => {
    if (deliveryDatesData) {
      const deliveryDatesArray = [
        {
          label: "Select Delivery Date",
          value: null,
          charges: 0,
        },
      ]
      const currentDate = bookingData?.data?.created_at ? new Date(bookingData.data.created_at) : new Date()
      const chargesData = ranges
      const maxToDay = Math.max(...chargesData.map((item) => item.to_day))

      for (let i = 0; i <= maxToDay; i++) {
        const date = new Date(currentDate)
        date.setDate(currentDate.getDate() + i)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const formattedDate = `${date.getDate()}-${monthNames[date.getMonth()]}-${date.getFullYear()}`

        let currentCharges = 0
        for (const range of chargesData) {
          if ((!range.type || range.type === (metalType === 'retail_gold' ? 'gold' : metalType)) && i >= range.from_day && i <= range.to_day) {
            currentCharges = (metalType === 'gold' || metalType === 'retail_gold') ? range.charges / 10 : range.charges / 1000
            break
          }
        }

        deliveryDatesArray.push({
          label: `${formattedDate} (₹${((metalType === 'gold' || metalType === 'retail_gold') ? currentCharges * 1 : currentCharges * 1000).toFixed(0)}/${(metalType === 'gold' || metalType === 'retail_gold') ? 'gm' : 'kg'} Extra Charges)`,
          value: formattedDate,
          charges: currentCharges,
        })
      }
      setDateOptions(deliveryDatesArray)
    }
  }, [deliveryDatesData, ranges, metalType, bookingData])

  useEffect(() => {
    if (selectedDate) {
      const selectedOption = dateOptions.find((date) => (date.value === selectedDate))
      setCharges(selectedOption ? selectedOption.charges : 0)
    }
  }, [selectedDate, dateOptions])

  useEffect(() => {
    const interval = setInterval(async () => {
      const apiRes = await LiveRateApi.fetch()
      if (apiRes) {
        setCurrentGoldRate(apiRes.includingTds / 10)
        setCurrentRetailGoldRate(apiRes.retailGoldRate / 10)
        const sRate = apiRes.silverPrice || apiRes.silverRate || 0
        setCurrentSilverRate((apiRes.silverCostHigh || sRate) / 1000)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleSearchString = (e, value, reason) => {
    setSearchText(value)
  }

  // Initialize form with booking data when it's loaded
  useEffect(() => {
    console.log('bookingData', bookingData);
    if (bookingData && bookingData.data) {
      const booking = bookingData.data

      // Find the client in clientsData
      if (activeUser.is_admin == 1 && booking.client_id && clientsData.length > 0) {
        const client = clientsData.find((c) => c.id === booking.client_id)
        if (client) {
          setSelectedClient(client)
        }
      }

      // Set selected date
      if (booking.delivery_date) {
        setSelectedDate(booking.delivery_date)
        const bookingDate = dayjs(booking.delivery_date, "DD-MMM-YYYY")
        const today = dayjs().startOf('day')
        if (bookingDate.isBefore(today)) {
          setIsPastDate(true)
        }
      }

      // Initialize form values
      formik.setValues({
        client_id: booking.client_id || "",
        rate: booking.rate || (metalType === 'gold' ? currentGoldRate : (metalType === 'retail_gold' ? currentRetailGoldRate : currentSilverRate)),
        quantity: (metalType === 'silver') ? (booking.quantity / 1000) : (booking.quantity || 0),
        total_amount: booking.total_amount || 0,
        byType: booking.quantity_or_amount === 0 ? "quantity" : "amount",
        remarks: booking.remarks || "",
        rateOption: "manual",
        is_pending_order: booking.is_pending_order || 0,
        type: booking.type || "gold",
      })
      if (booking.type) setMetalType(booking.type)
    }
  }, [bookingData, clientsData, metalType])

  const formik = useFormik({
    initialValues: {
      client_id: bookingData?.data?.client_id || "",
      rate: bookingData?.data?.rate || (metalType === 'gold' ? currentGoldRate : (metalType === 'retail_gold' ? currentRetailGoldRate : currentSilverRate)),
      quantity: bookingData?.data?.quantity || 0,
      total_amount: bookingData?.data?.total_amount || 0,
      byType: bookingData?.data?.quantity_or_amount === 0 ? "quantity" : "amount",
      remarks: bookingData?.data?.remarks || "",
      rateOption: "manual",
      is_pending_order: bookingData?.data?.is_pending_order || 0,
      type: bookingData?.data?.type || metalType,
    },
    validationSchema: activeUser.is_admin == 1 ? bookingsSchemaAdmin : bookingsSchemaNonAdmin,
    onSubmit: (values) => {
      handleFormSubmit(values)
    },
    enableReinitialize: true,
  })

  const handleFormSubmit = async (values) => {
    try {
      const bookingUpdateData = {
        id: bookingId,
        values: {
          client_id: activeUser.is_admin == 0 ? activeUser.id : values.client_id,
          quantity_or_amount: values.byType == "quantity" ? 0 : 1,
          rate: values.rateOption === "current" ? (metalType === 'gold' ? currentGoldRate : (metalType === 'retail_gold' ? currentRetailGoldRate : currentSilverRate)) : ((metalType === 'gold' || metalType === 'retail_gold') ? values.rate / 10 : values.rate / 1000),
          remarks: values.remarks,
          created_by: activeUser.is_admin == 1 ? "admin" : activeUser.id,
          delivery_date: selectedDate,
          delivery_charges: (charges > 0 && values.byType === 'quantity') ? charges * (metalType === 'silver' ? values.quantity * 1000 : values.quantity) : 0,
          is_pending_order: values.is_pending_order,
          total_amount: values.byType === "quantity" ? (values.rate * (metalType === 'silver' ? values.quantity * 1000 : values.quantity)) : values.total_amount,
          type: metalType,
        }
      }

      if (values.byType === "quantity") {
        bookingUpdateData.values.quantity = metalType === 'silver' ? values.quantity * 1000 : values.quantity
      } else {
        bookingUpdateData.values.delivery_charges =
          charges > 0 && bookingUpdateData.rate
            ? Math.floor((values.total_amount / bookingUpdateData.rate) * 100) / 100
            : 0
        bookingUpdateData.values.total_amount = values.total_amount
      }
      const res = await updateBooking(bookingUpdateData)
      if (res.data && res.data.code === 200) {
        toast.success("Booking updated successfully")
        setTimeout(() => {
          navigate("/bookings")
        }, 500)
      } else if (res.error?.data?.code === 400) {
        toast.error(res.error.data.message)
      }
    } catch (error) {
      console.log("Error while updating booking:", error)
      toast.error("Error while updating booking")
    }
  }

  if (isBookingLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Paper sx={{ p: { xs: 2, sm: 2, md: 3, mt: 3 }, borderRadius: "15px", margin: "1rem" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit(e)
          }}
        >
          <Grid2 container alignItems="center" justifyContent="space-between">
            {/* Heading */}
            <Grid2 item>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#001C76" }}>
                Edit Booking
              </Typography>
            </Grid2>

            {/* Metal Selection (Locked in Edit) */}
            <Grid2 item>
              <Box
                sx={{
                  px: 4, py: 1, borderRadius: '8px',
                  backgroundColor: metalType === 'gold' ? '#FFD700' : '#C0C0C0',
                  color: '#000', fontWeight: 'bold', textTransform: 'uppercase',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                {metalType}
              </Box>
            </Grid2>

            {/* Pending Order Switch */}
            <Grid2 item>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.is_pending_order === 1}
                    onChange={(event) => formik.setFieldValue("is_pending_order", event.target.checked ? 1 : 0)}
                  />
                }
                label={"Is Pending Order"}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={2}>
            <Grid2 item size={{ xs: 12, md: 6 }} hidden={activeUser.is_admin == 1 ? false : true}>
              <Typography sx={{ my: 1 }}>Booking for</Typography>
              <Autocomplete
                disabled={isSubAdmin}
                disablePortal
                options={clientsData}
                loading={isLoading || isFetching}
                sx={{ width: "100%" }}
                value={selectedClient}
                onChange={(_, value) => {
                  setSelectedClient(value)
                  formik.setFieldValue("client_id", value?.id)
                }}
                onInputChange={handleSearchString}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={formik.touched.client_id && Boolean(formik.errors.client_id)}
                    helperText={formik.touched.client_id && formik.errors.client_id}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
            <Grid2 item size={{ xs: 12, md: activeUser.is_admin == 1 ? 6 : 12 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
                <Typography>{(metalType === 'gold' || metalType === 'retail_gold') ? (metalType === 'retail_gold' ? 'Retail Gold ' : 'Gold ') : 'Silver '}Balance</Typography>
                <Typography sx={{ ml: 2, color: "text.secondary" }}>Total {(metalType === 'gold' || metalType === 'retail_gold') ? (metalType === 'retail_gold' ? 'Retail Gold ' : 'Gold ') : 'Silver '}Limit: {limit}</Typography>
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
                    onChange={(e) => formik.setFieldValue("rateOption", e.target.value)}
                    row
                    name="rateOption"
                  >
                    <FormControlLabel value="current" control={<Radio />} label="Current rate" />
                    <FormControlLabel value="manual" control={<Radio />} label="Manually" />
                  </RadioGroup>
                </FormControl>
              ) : (
                <Typography sx={{ my: 1.2 }}>Current Rate</Typography>
              )}
              {activeUser.is_admin == 1 ? (
                formik.values.rateOption === "current" ? (
                  <TextField disabled sx={{ mt: 1 }} value={metalType === 'gold' ? currentGoldRate * 10 : (metalType === 'retail_gold' ? currentRetailGoldRate * 10 : currentSilverRate * 1000)} fullWidth name="rate" />
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
              )}
            </Grid2>
            <Grid2 item size={{ xs: 12, md: 6 }}>
              <FormControl>
                <RadioGroup
                  value={formik.values.byType}
                  onChange={(e) => formik.setFieldValue("byType", e.target.value)}
                  row
                  name="byType"
                >
                  <FormControlLabel value="quantity" control={<Radio />} label="By Quantity" />
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
              Delivery Date & Charges {isPastDate && "(Past Date - Cannot Change)"}
            </Typography>
            <Autocomplete
              disabled={isPastDate}
              sx={{ mt: 1 }}
              options={dateOptions}
              value={dateOptions.find((option) => option.value === selectedDate) || null}
              getOptionLabel={(option) => option.label}
              onChange={(_, value) => setSelectedDate(value?.value)}
              renderInput={(params) => <TextField {...params} placeholder="Select Date" />}
            />
          </Box>
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
            <LoadingButton loading={updatingBooking} variant="contained" type="submit">
              Update Booking
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </>
  )
}

