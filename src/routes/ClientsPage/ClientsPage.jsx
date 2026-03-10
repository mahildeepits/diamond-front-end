import { Box, Button, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import { AddCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ClientsComponent from "../../components/ClientsComponent/ClientsComponent";
import useUserPermissions from "../../utils/useSubAdmin";

export default function ClientsPage() {
  const { isSubAdmin } = useUserPermissions();
  return (
    <Container maxWidth="xl">
      {/* <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Users</Typography>]}
        />
      </Box> */}
      <Box
        sx={{
          my: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">Manage Users</Typography>
        <Link to="add">
          <Button
            disabled={isSubAdmin}
            variant="outlined"
            startIcon={<AddCircle />}
          >
            Add Users
          </Button>
        </Link>
      </Box>
      <ClientsComponent isSubAdmin={isSubAdmin} />
    </Container>
  );
}
