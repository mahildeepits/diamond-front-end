import { Navigate, Outlet, useNavigate } from "react-router";
import LandingHeader from "../components/Frontend/Header/LandingHeader";
import LandingFooter from "../components/Frontend/Footer/LandingFooter";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { setCurrentUser, useFetchRateDifferenceQuery } from "../store";
import { useLocation } from "react-router-dom"; // Import useLocation to check the current route
// import Footer from "../components/Frontend/Footer/Footer";
export default function FrontendLayout() {
  const user = useSelector((state) => {
    return state.CurrentUser.user;
  });
  const location = useLocation(); // Get the current route
  useEffect(() => {
    const navigationType = performance.navigation.type;
    if (navigationType === 1 && location.pathname === '/') {
      sessionStorage.setItem('popupClosed', false)
    }
  }, []);
  return (
    <>
      <Box sx={{ display: "flex", overflow: "hidden", maxHeight: "100vh", padding: "0px 0px" }}>
        <aside>
          {
            user
          }
        </aside>
        <Box
          sx={{
            width: "100%",
            overflowX: "hidden",
            backgroundColor: "white",
            padding: "0px 0px",
          }}
        >
          {location.pathname !== '/' && (
            <Box
              sx={{
                // borderBottom: "1px solid #E5E5E59E",
              }}
            >
              <header>
                <LandingHeader />
              </header>
            </Box>
          )}
          <Box
            className={location.pathname === '/' ? "" : "styledScroll"}
            sx={{
              minHeight: location.pathname === '/' ? "100vh" : "71.5vh",
              overflowY: location.pathname === '/' ? "visible" : "auto",
              background: location.pathname === '/' ? "linear-gradient(180deg, #1a1615 0%, #1a1615 45%, #d1a14a 65%, #ffffff 100%)" : "linear-gradient(180deg, #1a1615 0%, #1a1615 45%, #d1a14a 65%, #ffffff 100%)",
              // boxShadow: location.pathname === '/' ? "none" : "inset 0.1px 0.1px 3px #aeaeae",
              padding: "0px 0px"
            }}
          >
            <Outlet />
          </Box>
          {location.pathname !== '/' && (
            <Box>
              <footer>
                <LandingFooter />
              </footer>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}