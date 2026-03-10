import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Logo from "../../../assets/images/ansh-icon.png";
import { useNavigate } from "react-router";
import LoginIcon from '@mui/icons-material/Login';

const pages = [
  {
    'name':'Live Rates',
    'url':'/'
  },
  {
    'name': 'Download',
    'url': '/download'
  },
  {
    'name': 'Bank Details',
    'url': '/bankdetails'
  },
  {
    'name': 'Booking Desk',
    'url': '/bookingdesk'
  },
  {
    'name': 'About Us',
    'url': '/aboutus'
  },
  {
    'name': 'Contact Us',
    'url': '/contactus'
  },
];
  
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function FrontendSidebar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [activeLink, setActiveLink] = React.useState('');  
  const navigate = useNavigate(); // Hook for navigation

  const handleOpenNavMenu = (event) => {
    console.log(event);
    setAnchorElNav(event.currentTarget);
    console.log(anchorElNav);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (url) => {
    setAnchorElNav(null);
    if (url) {
      navigate(url); // Navigate to the specified URL
      setActiveLink(url);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="white" >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{justifyContent:'space-between'}}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 , alignItems: 'center', gap: 1 }}>
            <Box sx={{ height: { lg: "32px", md: "24px", sm: "10px" } }}>
              <img src={Logo} height={"100%"} width={"100%"} />
            </Box>
            <Typography            
              noWrap
              varient="h4"
              component="a"
              href="javascript:void(0)"
              onClick={() => handleCloseNavMenu('/')}
              sx={{ color: "#000088" }}
            >
              Ansh Jewellers
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, marginLeft: "1rem" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((item) => (
                <MenuItem key={item.name} onClick={() => handleCloseNavMenu(item.url)} sx={{
                 color: activeLink === item.url ? 'white' : 'black',
                    fontWeight: activeLink === item.url ? 'bold' : 'normal',
                    bgcolor: activeLink === item.url ? '#000088' : 'none',
                }} >
                  <Typography sx={{
                    textAlign: 'center',
                    
                    }} >{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, alignItems: 'center', justifyContent:'center', gap: 1 }}>
            <Box sx={{ height: '25px' }}>
              <img src={Logo} height={"100%"} width={"100%"} />
            </Box>
            <Typography            
              noWrap
              varient="h4"
              component="a"
              onClick={() => handleCloseNavMenu('/')}
              sx={{ color: "blue" }}
            >
              Ansh Jewellers
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' },gap:2, ml: 5 }}>
            {pages.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleCloseNavMenu(item.url)}
                sx={{
                  my: 2,
                  display: 'block',
                  color: activeLink === item.url ? 'white' : 'black',
                  fontWeight: activeLink === item.url ? 'bold' : 'normal',
                  bgcolor: activeLink === item.url ? '#000088' : 'none',
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Button onClick={() => handleCloseNavMenu('/login')} sx={{ my: 2, color: 'blue', display: {xs: 'block', md: 'block'} }} > <LoginIcon/> </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default FrontendSidebar;