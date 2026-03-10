import { useSelector } from "react-redux";
import { Box, Button, Container, Modal, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import QuickLinksComponents from "../../components/DashboardComponents/QuickLinksComponents";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import FrontEndLiveRatesComponent from "../../components/AllRatesComponents/FrontEndLiveRatesComponent";


export default function HomePage() {
  const user = useSelector((state) => {
    return state.CurrentUser.user;
  });
  const breadcrumbs = [<Typography key={1}>Dashboard</Typography>];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
      </Box>
      <Box sx={{ mb: 6 }} ><FrontEndLiveRatesComponent /></Box>

      <Box sx={{ mb: 6 }} ><QuickLinksComponents /></Box>

      {/* <Box sx={{ position: 'fixed', bottom: "1rem", right: "1rem" }}>
        <Button onClick={() => setOpenBookingModal(true)} variant="contained" color="primary" >Add Booking</Button>
      </Box> */}
      {/* <Modal open={openBookingModal} 
        onClose={() => setOpenBookingModal(false)} 
        aria-labelledby="create-booking-modal"
      >
        <Box> */}
      {/* <Button onClick={() => setOpenBookingModal(false)} sx={{ position: 'absolute', top: "1rem", right: "1rem" }}><ClearIcon /></Button> */}
      {/* <AddBookingComponent onComplete={() => setOpenBookingModal(false)} activeUser={user}/> */}
      {/* </Box>
      </Modal> */}
    </Container>
  );
}
