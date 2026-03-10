import { Box, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import RateDifferenceComponent from "../../components/RateDifferenceComponents/RateDifferenceComponent";
import { useEffect, useState } from "react";
import { useFetchRateDifferenceQuery } from "../../store";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import ErrorComponent from "../../components/Loader/ErrorComponent";

export default function RateDifferencePage() {
  const [rateDifference, setRateDifference] = useState({});
  const { data, isLoading, error } = useFetchRateDifferenceQuery();
  useEffect(() => {
    if (data) {
      if (data.code == 200) {
        setRateDifference(data.data[0]);
      }
    } else if (error) {
      toast.error("Error while fetching data");
    }
  }, [data, error]);
  const breadcrumbs = [<Typography key={1}>Rate Difference</Typography>];
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1, mb: 2 }}>
        <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
      </Box>
      <Box sx={{ my: 1 }}>
        <Typography variant="pageHeading">Add rate difference</Typography>
      </Box>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorComponent />
      ) : (
        <RateDifferenceComponent data={rateDifference} />
      )}
    </Container>
  );
}
