import { Link } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import ConsolidateByClient from "../../components/BookingsComponents/BookingConsolidate/ConsolidateByClient";
import ConsolidateByDate from "../../components/BookingsComponents/BookingConsolidate/ConsolidateByDate";
import TotalBooking from "../../components/BookingsComponents/BookingConsolidate/TotalBooking";

export default function BookingConsolidatePage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[
            <Link
              style={{ textDecoration: "underline" }}
              to={"/bookings"}
              key={0}
            >
              Bookings
            </Link>,
            <Typography key={1}>Consolidate</Typography>,
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
        <Typography variant="pageHeading">
          Manage booking consolidates
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box>
          <Typography variant="pageHeading">Total Consolidates</Typography>
          <TotalBooking />
        </Box>
        <Box>
          <Typography variant="pageHeading">Consolidates by Date</Typography>
          <ConsolidateByDate />
        </Box>
        <Box>
          <Typography variant="pageHeading">Consolidates by Clients</Typography>
          <ConsolidateByClient />
        </Box>
      </Box>
    </Container>
  );
}
