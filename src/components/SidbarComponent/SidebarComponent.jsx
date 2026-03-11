import { useState, useEffect } from "react";
import { Box, Badge, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideLinks from "./SidebarLink";
import Logo from "../../assets/images/logo-hori.png";

export default function SidebarComponent() {
  const [open, setOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  // useEffect(() => {
  //   const count = JSON.parse(localStorage.getItem("conversation_ids")) || [];
  //   setBadgeCount(count.length);
  // },[registerConversationListeners])

  return (
    <>
      {/* Menu Icon Button */}
      <IconButton
        sx={{ position: "absolute", top: 1, left: 10, zIndex: 9, display: { xs: "none", sm: "block" } }}
        onClick={() => setOpen(!open)}>
        <Badge badgeContent={(badgeCount > 0 && !open) ? badgeCount : 0} color="primary" overlap="circular" invisible={false}>
          <MenuIcon />
        </Badge>
      </IconButton>

      {/* Drawer Menu */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 260 } }} // Adjust width
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              // alignItems: "right",
              // alignSelf: "flex-end",
              px: 1,
              position: 'absolute',
              top: '10px'
            }}
          >
            <Box sx={{ height: "30px" }}>
              <img src={Logo} height={"100%"} alt="Logo" />
            </Box>
          </Box>

          {/* Sidebar Links */}
          <Box sx={{ width: "100%", marginTop: "40px" }}>
            <SideLinks handleClose={() => setOpen(false)} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
