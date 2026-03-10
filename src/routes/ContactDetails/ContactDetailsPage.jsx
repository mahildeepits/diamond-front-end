import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useFetchAdminContactDetailsQuery } from "../../store";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import ContactDetailsComponent from "../../components/ContactDetailsComponent/ContactDetailsComponent";
import Loader from "../../components/Loader/Loader";
import ErrorComponent from "../../components/Loader/ErrorComponent";
export default function ContactDetailsPage() {
  const { data, isLoading, error } = useFetchAdminContactDetailsQuery();
  const [contactDetails, setContactDetails] = useState({});
  useEffect(() => {
    if (data) {
      if (data.code == 200) {
        setContactDetails(data.data);
      }
    }
  }, [data, error]);
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Contact Details</Typography>]}
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
          Manage your contact details
        </Typography>
      </Box>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorComponent />
      ) : (
        <ContactDetailsComponent contactDetails={contactDetails} />
      )}
    </Container>
  );
}
