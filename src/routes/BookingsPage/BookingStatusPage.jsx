import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { Box, Container, Typography } from "@mui/material";
import ErrorComponent from "../../components/Loader/ErrorComponent";
import { useFetchBookingStatusQuery } from "../../store/apis/BookingsAPI";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import BookingStatusComponent from "../../components/BookingsComponents/BookingStatusComponent";
export default function BookingStatusPage() {
  const [bookingStatus, setBookingStatus] = useState({});
  const { data, isLoading, error } = useFetchBookingStatusQuery();
  useEffect(() => {
    if (data) {
      if (data.code == 200) {
        setBookingStatus(data.data);
      }
      console.log(data);
    }
  }, [data]);
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[
            <Link
              style={{ textDecoration: "underline", color: 'white' }}
              to={"/bookings"}
              key={0}
            >
              Bookings
            </Link>,
            <Typography key={1}>Status</Typography>,
          ]}
        />
      </Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">Manage booking status</Typography>
      </Box>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorComponent />
      ) : (
        <BookingStatusComponent data={bookingStatus} />
      )}
    </Container>
  );
}
