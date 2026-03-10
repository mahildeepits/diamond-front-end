import * as React from 'react';
import { useEffect } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import Logo from "../../../assets/images/ansh-icon.png";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router";
const pages = [
    {
      'name':'Live Rates',
      'url':'/'
    },{
      'name': 'Download',
      'url': '/download'
    },{
      'name': 'Contact Us',
      'url': '/contactus'
    },{
      'name': 'About Us',
      'url': '/aboutus'
    },{
      'name': 'Bank Details',
      'url': '/bankdetails'
    },{
      'name': 'Booking Desk',
      'url': '/bookingdesk'
    }];
export default function Footer() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const navigate = useNavigate(); // Hook for navigation
    const handleOpenNavMenu = (event) => {
        console.log(event);
        setAnchorElNav(event.currentTarget);
      };
    const handleCloseNavMenu = (url) => {
        setAnchorElNav(null);
        if (url) {
            navigate(url); // Navigate to the specified URL
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll after navigation
            }, 0);
        }
    };
    return (
        <>
            <Box sx={{backgroundColor: "#000088",padding:"30px 30px"}}>
                {/* Full-Width Banner */}
                <Box sx={{ display:'flex', mr: 1 , alignItems: 'center', gap: 1 , paddingBottom:"20px"
                }}>
                    <Box sx={{ height: { lg: "32px", md: "24px", sm: "24px", xs:"24px"},}}>
                        <img src={Logo} height={"100%"} width={"100%"} />
                    </Box>
                    <Typography            
                        noWrap
                        varient="h3"
                        component="a"
                        href="javascript:void(0)"
                        onClick={() => handleCloseNavMenu('/')}
                        sx={{ color: "white" }}
                    >
                        Ansh Jewellers
                    </Typography>
                </Box>
            
                {/* Container for Cards */}
                <Box
                    sx={{
                        display: {md:"flex",xs:"block"},
                        justifyContent: "center",
                        gap: 2,
                        color:"white"
                    }}
                    >
                    <Box  sx={{ flex: 1 }}>
                        <Typography sx={{
                            textDecoration:"bold",
                            fontWeight:"500",
                            fontSize:"15px",
                            padding:"10px 0",
                        }}>
                            Address
                        </Typography>
                        <Typography sx={{fontSize:"11px", wordSpacing:"7px",lineHeight:"25px"}}>
                        Green market, Shop no. 9, Gali no. 7, Talli Wala Bazar Chowk Area, Sultanwind road, Sarbar pura, Amritsar, Amritsar, Punjab, 143001
                        </Typography>
                    </Box>
                    <Box  sx={{ flex: 1 }}>
                        <Typography sx={{
                            textDecoration:"bold",
                            fontWeight:"500",
                            fontSize:"15px",
                            padding:"10px 0"
                        }}>
                            Phone
                        </Typography>
                        <Box sx={{display:"flex"}}>
                            <Box sx={{flex:"1" }}>
                                <Typography sx={{fontSize:"11px",lineHeight:"25px"}}>
                                    <ArrowForwardIosIcon fontSize="10px" /> +91 9417193330
                                </Typography>
                                {/* <Typography sx={{fontSize:"11px",lineHeight:"25px"}}>
                                    <ArrowForwardIosIcon fontSize="10px" /> 9417272494
                                </Typography> */}
                            </Box>
                            <Box sx={{flex:"1"}} >
                                <Typography sx={{fontSize:"11px",lineHeight:"25px"}}>
                                    <ArrowForwardIosIcon fontSize="10px" /> +91 7814621399
                                </Typography>
                                {/* <Typography sx={{fontSize:"11px",lineHeight:"25px"}}>
                                    <ArrowForwardIosIcon fontSize="10px" /> 9876543210
                                </Typography> */}
                            </Box>
                        </Box>
                        <Typography sx={{
                            textDecoration:"bold",
                            fontWeight:"500",
                            fontSize:"15px",
                            padding:"10px 0"
                        }}>
                            Email
                        </Typography>
                        <Typography sx={{fontSize:"11px",lineHeight:"25px"}}>
                            <ArrowForwardIosIcon fontSize="10px" /> Anshjewellers41289@gmail.com
                        </Typography>
                    </Box>
                    <Box  sx={{ flex: 1 }}>
                        <Typography sx={{
                            textDecoration:"bold",
                            fontWeight:"500",
                            fontSize:"15px",
                            padding:"10px 0"
                        }}>
                            Quick Links
                        </Typography>
                        <Box sx={{
                            display:"flex",
                            flexWrap:"wrap",
                            columnGap:6
                        }} >
                            {pages.map((item) => (
                                <Typography width={{xs:"100px",md:"150px"}} sx={{ cursor:"pointer",fontSize:"11px",lineHeight:"25px"}}>
                                <ArrowForwardIosIcon fontSize="10px" /> <span role='button'
                                        key={item.name}
                                        onClick={() => handleCloseNavMenu(item.url)}
                                        >
                                        {item.name}
                                    </span>
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                    
                </Box>
            </Box>
        </>
    );
}
