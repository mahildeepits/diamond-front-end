import { useState } from "react"
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import { toast } from "react-toastify"
import {
  useFetchBookingDatesQuery,
  useAddBookingDatesMutation,
  useDeleteBookingDatesMutation,
} from "../../store/apis/BookingsAPI"
import BreadcrumbsComponent from "../BreadcrumbsComponent/BreadcrumbsComponent";
import { Link } from "react-router-dom";
export default function BookingDatesComponent() {
  const [open, setOpen] = useState(false)
  const [fromDay, setFromDay] = useState("")
  const [toDay, setToDay] = useState("")
  const [charges, setCharges] = useState("")
  const [type, setType] = useState("gold")
  const [error, setError] = useState("")

  // Fetch delivery charges data
  const { data, isLoading, refetch } = useFetchBookingDatesQuery()

  // Mutations for adding and deleting delivery charges
  const [addBookingDates, { isLoading: isAdding }] = useAddBookingDatesMutation()
  const [deleteDeliveryCharge, { isLoading: isDeleting }] = useDeleteBookingDatesMutation()

  const handleClickOpen = () => {
    setOpen(true)
    // Reset form fields
    setFromDay("")
    setToDay("")
    setCharges("")
    setType("gold")
    setError("")
  }

  const handleClose = () => {
    setOpen(false)
  }

  const validateForm = () => {
    if (!fromDay || !toDay || !charges) {
      setError("All fields are required")
      return false
    }

    const fromDayNum = Number.parseInt(fromDay)
    const toDayNum = Number.parseInt(toDay)
    const chargesNum = Number.parseFloat(charges)

    if (isNaN(fromDayNum) || isNaN(toDayNum) || isNaN(chargesNum)) {
      setError("Please enter valid numbers")
      return false
    }

    if (fromDayNum < 0 || toDayNum < 0 || chargesNum < 0) {
      setError("Values cannot be negative")
      return false
    }

    if (fromDayNum > toDayNum) {
      setError("From Day must be less than or equal to To Day")
      return false
    }

    // Check for overlapping ranges
    if (data && data.data) {
      const overlapping = data.data.some((range) => {
        // Skip if we're editing the same range
        if (range.id === editingId) return false

        // Check if ranges overlap and are of the same type
        return (
          range.type === type && (
            (fromDayNum >= range.from_day && fromDayNum <= range.to_day) ||
            (toDayNum >= range.from_day && toDayNum <= range.to_day) ||
            (range.from_day >= fromDayNum && range.from_day <= toDayNum)
          )
        )
      })

      if (overlapping) {
        setError("This range overlaps with an existing range")
        return false
      }
    }

    setError("")
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const payload = {
        from_day: Number.parseInt(fromDay),
        to_day: Number.parseInt(toDay),
        charges: Number.parseFloat(charges),
        type: type,
      }

      if (editingId) {
        payload.id = editingId
      }

      const response = await addBookingDates(payload)
      console.log(payload, response);
      if ("data" in response && response.data.code === 200) {
        toast.success(editingId ? "Range updated successfully" : "Range added successfully")
        handleClose()
        refetch()
      } else if ("error" in response) {
        toast.error("Error occurred")
        console.error(response.error)
      }
    } catch (error) {
      toast.error("Error occurred")
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this range?")) {
      try {
        const response = await deleteDeliveryCharge(id)

        if ("data" in response && response.data.code === 200) {
          toast.success("Range deleted successfully")
          refetch()
        } else if ("error" in response) {
          toast.error("Error occurred")
          console.error(response.error)
        }
      } catch (error) {
        toast.error("Error occurred")
        console.error(error)
      }
    }
  }

  // For editing functionality
  const [editingId, setEditingId] = useState(null)

  const handleEdit = (range) => {
    setEditingId(range.id)
    setFromDay(range.from_day.toString())
    setToDay(range.to_day.toString())
    setCharges(range.charges.toString())
    setType(range.type || "gold")
    setOpen(true)
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{
        my: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <BreadcrumbsComponent
          breadcrumbs={[
            <Link
              style={{ textDecoration: "underline", color: 'white' }}
              to={"/bookings"}
              key={0}
            >
              Bookings
            </Link>,
            <Typography key={1}>Delivery Charges</Typography>,
          ]}
        />
        <Button variant="contained" startIcon={<Add />} onClick={handleClickOpen}>
          Add New Range
        </Button>
      </Box>
      {/* <Box
        sx={{
          my: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="pageHeading">
          Delivery Charges Management
        </Typography>

      </Box> */}
      <Paper sx={{
        p: { xs: 2, sm: 2, md: 3 },
        borderRadius: "15px",
        mt: 2,
        bgcolor: "white",
        color: "black",
        "& .MuiTableCell-root": { color: "black", borderBottom: "1px solid rgba(0,0,0,0.1)" },
        "& .MuiTypography-root": { color: "black" },
      }}>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : data && data.data && data.data.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>From Day</TableCell>
                  <TableCell>To Day</TableCell>
                  <TableCell>Charges/gm (₹)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((range) => (
                  <TableRow key={range.id}>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{range.type || 'gold'}</TableCell>
                    <TableCell>{range.from_day}</TableCell>
                    <TableCell>{range.to_day}</TableCell>
                    <TableCell>{range.charges}/Gm</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        {/* <Button size="small" onClick={() => handleEdit(range)} sx={{ mr: 1 }}>
                          Edit
                        </Button> */}
                        <IconButton color="error" onClick={() => handleDelete(range.id)} disabled={isDeleting}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No delivery charge ranges found. Add a new range to get started.</Alert>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "white",
            color: "black",
            "& .MuiTypography-root": { color: "black" },
            "& .MuiOutlinedInput-root": { background: "#f4f4f4", color: "black" },
            "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" },
            "& .MuiSelect-select": { color: "black" },
            "& .MuiSvgIcon-root": { color: "black" }
          }
        }}
      >
        <DialogTitle>{editingId ? "Edit Range" : "Add New Range"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="gold">Gold</MenuItem>
                <MenuItem value="silver">Silver</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="From Day"
              type="number"
              fullWidth
              value={fromDay}
              onChange={(e) => setFromDay(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <TextField
              label="To Day"
              type="number"
              fullWidth
              value={toDay}
              onChange={(e) => setToDay(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <TextField
              label="Charges/gm (₹)"
              type="number"
              fullWidth
              value={charges}
              onChange={(e) => setCharges(e.target.value)}
              InputProps={{ inputProps: { min: 0, step: "0.1" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isAdding}>
            {isAdding ? <CircularProgress size={24} /> : editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
