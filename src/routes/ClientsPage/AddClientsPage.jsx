import { Box, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import { Link } from "react-router-dom";
import AddClientComponent from "../../components/ClientsComponent/AddClientComponent";

export default function AddClientsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[
            <Link
              style={{ textDecoration: "underline" }}
              key={1}
              to={"/clients"}
            >
              Users
            </Link>,
            <Typography key={2}>Add/Edit user</Typography>,
          ]}
        />
      </Box>
      <AddClientComponent />
    </Container>
  );
}
