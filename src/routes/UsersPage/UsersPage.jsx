import { Box, Button, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import { AddCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import UsersComponent from "../../components/UsersComponent/UsersComponent";
import useUserPermissions from "../../utils/useSubAdmin";

export default function ClientsPage() {
  const { isSubAdmin } = useUserPermissions();
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Users</Typography>]}
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
        <Typography variant="pageHeading">Manage users</Typography>
        {isSubAdmin ? (
          <Button
            disabled={isSubAdmin}
            variant="outlined"
            startIcon={<AddCircle />}
          >
            Add user
          </Button>
        ) : (
          <Link to="add">
            <Button variant="outlined" startIcon={<AddCircle />}>
              Add user
            </Button>
          </Link>
        )}
      </Box>
      <UsersComponent />
    </Container>
  );
}
