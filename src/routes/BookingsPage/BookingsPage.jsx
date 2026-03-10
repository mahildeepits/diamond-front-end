import { Box, Button, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { Link } from "react-router-dom";
import BookingsList from "../../components/BookingsComponents/BookingsList";
import { useSelector } from "react-redux";
export default function BookingsPage() {
  const userDetails = useSelector((state) => state.CurrentUser.user);
  const isAdmin = userDetails.is_admin === 1;
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Bookings</Typography>]}
        />
      </Box>
      {/* <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">Manage bookings</Typography>
        <Box
          sx={{
            display: { sm: "flex", xs: "none" },
            alignItems: "center",
            gap: "10px",
          }}
        >
          {isAdmin && (<>
            <Link to="client-wise">
              <Button variant="outlined" startIcon={<GroupWorkOutlinedIcon />}>
                Client wise
              </Button>
            </Link>
            <Link to="/delivery/charges">
              <Button variant="outlined" startIcon={<GroupWorkOutlinedIcon />}>
                Delivery Charges
              </Button>
            </Link>
            <Link to="status">
              <Button variant="outlined" startIcon={<AccessTimeOutlinedIcon />}>
                Status
              </Button>
            </Link>
          </>)}
        </Box>
      </Box> */}
      <BookingsList />
    </Container>
  );
}
