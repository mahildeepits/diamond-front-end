"use client"

import { useEffect, useState } from "react"
import { Box, Container, Paper, Typography } from "@mui/material"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router"
import { setCurrentUser, useFetchRateDifferenceQuery } from "../store"
import NavbarComponent from "../components/NavbarComponent/NavbarComponent"
import SidebarComponent from "../components/SidbarComponent/SidebarComponent"
import SupportChat from "../components/ChatsComponents/SupportChat"
import { useSocket } from "../contexts/socket-context"
import { useLocation } from "react-router-dom";
import { NotificationsComponent } from "../components/NotificationsComponent/NotificationsComponent"


export default function Layout() {
  const user = useSelector((state) => {
    return state.CurrentUser.user
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, isLoading, error } = useFetchRateDifferenceQuery()
  useEffect(() => {
    if (error) {
      if (error && error.status == 401) {
        toast.error("Session Expired, Please login again")
        dispatch(setCurrentUser(null))
        // navigate("/login");
      }
    }
  }, [data, error])
  const location = useLocation();

  // Check if the current route is not /chats
  const showNotifications = location.pathname.startsWith('/chats') ? false : true;
  return (
    <>
      <Box sx={{ display: "flex", overflow: "hidden", maxHeight: "100vh" }}>
        <aside>{user && <SidebarComponent />}</aside>
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            backgroundColor: "background.default",
          }}
        >
          <Box
          >
            <header>
              <NavbarComponent />
            </header>
          </Box>

          <Box
            className="styledScroll"
            sx={{
              height: "100%",
              minHeight: "100vh",
              overflowY: "auto",
              background: "linear-gradient(180deg, #1d1818 30%, #af9560 40%, #fffefd 60%, #fff6ef 100%)",
              boxShadow: "inset 0.1px 0.1px 3px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              pb: { md: "65px", sm: "54px", xs: "60px" },
            }}
          >
            <Container>
              <Outlet />
            </Container>
          </Box>
        </Box>
        {user && !user.is_admin && <SupportChat />}
      </Box>
      {(showNotifications == "true" || showNotifications == true) && user && user.is_admin && <NotificationsComponent />}
    </>
  )
}
