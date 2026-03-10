import {
  List,
  Tooltip,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "../../utils/Links";
import { useSelector } from "react-redux";

export default function SideLinks({ handleClose }) {
  const { pathname } = useLocation();
  const userDetails = useSelector((state) => state.CurrentUser.user);
  const links = sidebarLinks();
  return (
    <nav>
      <List>
        {links.map((link) => {
          const { id, name, icon, href, show } = link;
          return (show === true) ? (
            <Link key={id} to={href} style={{ color: "inherit" }} onClick={() => { if (handleClose) handleClose(); }}>
              <ListItem
                disableGutters={true}
                disablePadding
                sx={{
                  mb: 1,
                  borderRadius: "15px",
                  color: pathname === href ? "#1a1615" : "text.secondary",
                  border: pathname === href ? "none" : "1px solid transparent",
                  backgroundColor: pathname === href ? "primary.main" : "transparent",
                  "&:hover": {
                    color: pathname === href ? "#1a1615" : "primary.main",
                    border: pathname === href ? "none" : "1px solid",
                    borderColor: "primary.main",
                  },
                  "&:hover .sideIcon": {
                    color: pathname === href ? "#1a1615" : "primary.main",
                    fontWeight: 600,
                  },
                  ".MuiListItemIcon-root": {
                    minWidth: { lg: "40px", md: "30px", sm: "20px" },
                  },
                  ".MuiListItemButton-root": {
                    display: "flex",
                    justifyContent: "center",
                  },
                }}
              >
                <ListItemButton
                  disableRipple
                  sx={{
                    borderRadius: "inherit",
                    padding: { sm: "5px", md: "10px", lg: "10px 20px" },
                    "&:hover": {
                      backgroundColor: "inherit",
                      borderRadius: "inherit",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: pathname === href ? "#1a1615" : "primary.main",
                    }}
                  >
                    <Tooltip title={name}>{icon}</Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    sx={{ display: { lg: "flex", md: "none", sm: "none" } }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight:
                          pathname === href
                            ? 600
                            : 500,
                      }}
                    >
                      {name}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
          ) : (<React.Fragment key={id}></React.Fragment>);
        })}
      </List>
    </nav>
  );
}
