import { Box, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import { Link } from "react-router-dom";
import AddUserComponent from "../../components/UsersComponent/AddUserComponent";

export default function AddUsersPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[
            <Link style={{ textDecoration: "underline" }} key={1} to={"/users"}>
              Users
            </Link>,
            <Typography key={2}>Add user</Typography>,
          ]}
        />
      </Box>
      <AddUserComponent />
    </Container>
  );
}
