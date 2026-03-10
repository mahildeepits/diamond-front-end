import { Card, CardContent, Typography, Grid2 } from "@mui/material";

export default function BookingTotalsComponent({ bookings, totals_for = "bookings" }) {
  // Calculate Totals
  const totalOrders = (totals_for == 'bookings') ? bookings.length : bookings.reduce((sum, b) => sum + (b.record_count || 0), 0);
  const totalQuantity = bookings.reduce((sum, b) => sum + ((totals_for == 'bookings') ? (parseFloat(b.order?.quantity) || 0) : (parseFloat(b.total_quantity) || 0)), 0)
  const totalAmount = bookings.reduce((sum, b) => sum + ((totals_for == 'bookings') ? (parseFloat(b.order?.total_amount) || 0) : (parseFloat(b.total_amount) || 0)), 0);

  return (
    <Grid2 container sx={{ display: "flex", gap: "10px", mt: 2 }}>
      <Grid2 item sm={6} md={4} textAlign={'center'}>
        <Card sx={{ bgcolor: "transparent", border: "1px solid #d1a14a", color: "#d1a14a", fontSize: "13px" }} >
          <CardContent sx={{ padding: '5px 15px!important' }}>
            <Typography variant="span">Total Orders : {totalOrders}</Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item sm={6} md={4} textAlign={'center'}>
        <Card sx={{ bgcolor: "transparent", border: "1px solid #d1a14a", color: "#d1a14a", fontSize: "13px" }} >
          <CardContent sx={{ padding: '5px 15px!important' }}>
            <Typography variant="span">Total Quantity : {totalQuantity.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item sm={12} md={4} textAlign={'center'}>
        <Card sx={{ bgcolor: "transparent", border: "1px solid #d1a14a", color: "#d1a14a", fontSize: "13px", width: "100%" }} >
          <CardContent sx={{ padding: '5px 15px!important', width: '100%' }}>
            <Typography variant="span">Total Amount : ₹ {totalAmount.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}
