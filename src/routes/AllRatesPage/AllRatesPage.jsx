/* The code snippet provided is a JavaScript React component that defines an `AllRatesPage` functional
component. */
import { Box, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import FrontEndLiveRatesComponent from "../../components/AllRatesComponents/FrontEndLiveRatesComponent";



export default function AllRatesPage() {
  
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Market Rates</Typography>]}
        />
      </Box>
      <FrontEndLiveRatesComponent />
    </Container>
  );
}
