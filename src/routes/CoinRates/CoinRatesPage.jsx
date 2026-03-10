import { Box, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import CoinRatesComponent from "../../components/AllRatesComponents/CoinRatesComponent";

export default function CoinRatesPage() {
    const breadcrumbs = [<Typography key={1}>Coin Management</Typography>];
    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 1, mb: 2 }}>
                <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            </Box>
            <CoinRatesComponent />
        </Container>
    );
}
