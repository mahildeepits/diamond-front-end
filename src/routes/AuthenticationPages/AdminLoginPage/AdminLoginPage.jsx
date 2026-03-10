import { Box, Typography, useMediaQuery } from "@mui/material";
import AdminImg from "../../../assets/images/admin.png";
import styles from "./AdminLoginPage.module.css";
import LoginComponent from "../../../components/AuthComponents/LoginComponent";
import Logo from "../../../assets/images/dbh.png";

export default function AdminLoginPage() {
  const isXsScreen = useMediaQuery("(max-width:500px)");
  const boxStyles = {
    background: 'linear-gradient(180deg, #1a1615 0%, #1a1615 50%, #d1a14a 80%, #ffffff 100%)',
    height: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const variant = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.3,
      },
    },
  };
  return (
    <Box style={boxStyles}>
      <Box
        sx={{
          width: { xl: "80%", lg: "100%", md: "100%", sm: "100%", xs: "100%" },
          p: { lg: 10, md: 8, sm: 5, xs: 1 },
          height: "100%",
        }}
      >
        <Box
          className={styles.glass}
          sx={{
            p: { lg: 10, md: 8, sm: 5, xs: 1 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: { lg: "60%", md: "70%", sm: "100%", xs: "100%" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: "center" }}>
              <Box sx={{ height: { sm: "70px", xs: "50px" } }}>
                <img src={Logo} height={"100%"} />
              </Box>
              <Typography
                sx={{ fontSize: { lg: 35, md: 30, sm: 25, xs: 25 }, color: "#d1a14a", fontWeight: "bold" }}
                variant="loginText"
              >
                Welcome User
              </Typography>
            </Box>
            <Box>
              <LoginComponent variant={variant} />
            </Box>
          </Box>
          <Box sx={{ display: { md: "block", sm: "none", xs: "none" } }}>
            <img
              src={AdminImg}
              className={styles.adminImg}
              alt="admin-img-logo"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
