import {
  Box,
  List,
  Drawer,
  AppBar,
  Toolbar,
  Tooltip,
  Divider,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { LogoutOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, useLogoutMutation } from "../../store";
import { sidebarLinks } from "../../utils/Links";
import { toast } from "react-toastify";
import SideLinks from "../SidbarComponent/SidebarLink";
import AnshLogo from "../../assets/images/logo-hori.png";

export default function NavbarComponent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [handleLogout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => {
    return state.CurrentUser.user;
  });
  const handleClick = async () => {
    try {
      const res = await handleLogout();
      if (res.data.code == 200) {
        toast.success("Logged out successfully");
        dispatch(setCurrentUser(null));
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error while logging out");
      console.log("🚀 ~ handleClick ~ error:", error);
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  useEffect(() => {
    if (isLoading) console.log("loading...");
  }, [isLoading]);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <img
          src={AnshLogo}
          alt="logo"
          style={{ height: "30px", marginRight: "10px" }}
        />
        {/* <Typography >Diamond Bullion</Typography> */}
      </Box>
      <Divider />
      <List sx={{ padding: "0 12px" }}>
        <SideLinks />
        {/* {
          userDetails && (
            <ListItem
              disablePadding
              sx={{
                mb: 3,
                borderRadius: "10px",
                color: "black.main",
                backgroundColor: "none",
              }}
              onClick={handleClick}
            >
              <ListItemButton
                sx={{ padding: { sm: "5px", md: "15px", lg: "10px 20px" } }}
              >
                <ListItemText
                  sx={{ display: { lg: "flex", md: "none", sm: "none" } }}
                >
                  <Typography>Logout</Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )
        } */}
      </List>
    </Box>
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        minHeuight={1}
        position="static"
        sx={{ backgroundColor: "transparent", border: "none" }}
        elevation={0}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { sm: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Toolbar sx={{ minHeight: "1px !important", }}>
          <Box>
            <IconButton
              aria-label="menu"
              sx={{ mr: 2, display: { sm: "none", xs: "block" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              textAlign: "center",
            }}>
              <Typography
                onClick={() => navigate("/")}
                color="primary"
                sx={{
                  fontWeight: 700,
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <img
                  src={AnshLogo}
                  alt="logo"
                  style={{ height: "30px", marginTop: "5px" }}
                />
                {/* <p>Diamond Bullion</p> */}
              </Typography>

              {userDetails && userDetails.is_admin === 0 && (
                <Box sx={{ display: 'flex', gap: 1.5, ml: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ bgcolor: '#FFD700', px: 1, py: 0.2, borderRadius: '4px', color: '#000', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Gold</Box>
                      <Typography sx={{ color: 'primary.main', fontSize: '13px', fontWeight: 600 }}>
                        ₹{userDetails.is_subadmin ? userDetails.subadmin_gold_limit : userDetails.balance}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Box sx={{ bgcolor: '#C0C0C0', px: 1, py: 0.2, borderRadius: '4px', color: '#000', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Silver</Box>
                      <Typography sx={{ color: 'primary.main', fontSize: '13px', fontWeight: 600 }}>
                        ₹{userDetails.is_subadmin ? userDetails.subadmin_silver_limit : userDetails.silver_balance}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {userDetails ? (
                <Tooltip title="Logout">
                  <IconButton
                    onClick={handleClick}
                    sx={{
                      ml: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LogoutOutlined color="primary" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Login">
                  <IconButton
                    component={Link}
                    to="/login"
                    sx={{
                      ml: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      color="primary"
                      sx={{
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      Login
                    </Typography>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
