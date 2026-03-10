import { Box, Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
function BreadcrumbsComponent({ breadcrumbs }) {
  return (
    <Box
      sx={{
        backgroundColor: "dark.main",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon color="primary" fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
}

export default BreadcrumbsComponent;
