import React, { useState } from 'react';
import { Box, Container, Grid, IconButton, Drawer, List, ListItem, Typography } from '@mui/material';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Login, TrendingUpOutlined, InfoOutlined, AccountBalanceOutlined, PhoneOutlined, Call } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoImg from '../../../assets/images/dbh.png';
import '../NewLandingPage/LandingStyle.css';
import { useFetchAdminContactDetailsQuery } from '../../../store/apis/AdminAPI';

export default function LandingHeader() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { data: contactData } = useFetchAdminContactDetailsQuery();
    const contact = contactData?.data || {};

    return (
        <header className="landing-header">
            <Container sx={{ borderBottom: '2px solid #8e6c31', padding: { xs: '15px 0', md: '24px' }, width: { xs: '90%', md: '70%' } }}>
                <Grid container alignItems="center" sx={{ position: 'relative' }}>
                    <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        <NavLink to="/" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")} end>Live Rates</NavLink>
                        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")}>About Us</NavLink>
                        <NavLink to="/bankdetails" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")}>Bank Details</NavLink>
                    </Grid>

                    {/* Mobile Left: Menu Icon */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, position: 'absolute', left: 0, zIndex: 101 }}>
                        <IconButton sx={{ color: '#fdf6d4', padding: 0 }} onClick={() => setMobileOpen(true)}>
                            <MenuIcon sx={{ fontSize: '28px' }} />
                        </IconButton>
                    </Box>

                    {/* Logo center absolute overlapping */}
                    <Box sx={{ position: { xs: 'relative', md: 'absolute' }, top: { xs: 0, md: '10px' }, left: { xs: 0, md: '50%' }, transform: { xs: 'none', md: 'translateX(-50%)' }, zIndex: 100, width: { xs: '100%', md: 'auto' }, display: 'flex', justifyContent: 'center' }}>
                        <Box className="landing-logo-wrapper" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <img src={LogoImg} alt="Diamond Bullion" />
                        </Box>
                    </Box>

                    {/* Mobile Right: Login Icon */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, position: 'absolute', right: 0, zIndex: 101 }}>
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center' }}>
                            <Login sx={{ fontSize: '28px', color: '#fdf6d4' }} />
                        </Link>
                    </Box>

                    <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <NavLink to="/download" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")}>Downloads</NavLink>
                        <a href={`tel:+91${contact.first_contact_number || '+91985625486'}`} className="landing-phone-btn">
                            <Call style={{ width: '16px', marginRight: '5px' }} /> +91 {contact.first_contact_number || '+91-985625486'}
                        </a>
                        <NavLink to="/login" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")} ><Login sx={{ fontSize: '20px', color: '#fdf6d4' }} /></NavLink>
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile Drawer */}
            <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <Box sx={{ width: 280, backgroundColor: '#000', height: '100%', paddingTop: '30px' }}>
                    <Box sx={{ padding: '0 20px', marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                        <img src={LogoImg} alt="Diamond Bullion" style={{ height: '60px' }} />
                    </Box>
                    <List sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0px' }}>
                        <ListItem disablePadding onClick={() => setMobileOpen(false)}>
                            <NavLink to="/" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")} style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', textDecoration: 'none', padding: '10px 10px' }} end>
                                <TrendingUpOutlined sx={{ fontSize: '24px' }} /> Live Rates
                            </NavLink>
                        </ListItem>
                        <ListItem disablePadding onClick={() => setMobileOpen(false)}>
                            <NavLink to="/aboutus" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")} style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', textDecoration: 'none', padding: '10px 10px' }}>
                                <InfoOutlined sx={{ fontSize: '24px' }} /> About Us
                            </NavLink>
                        </ListItem>
                        <ListItem disablePadding onClick={() => setMobileOpen(false)}>
                            <NavLink to="/bankdetails" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")} style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', textDecoration: 'none', padding: '10px 10px' }}>
                                <AccountBalanceOutlined sx={{ fontSize: '24px' }} /> Bank Details
                            </NavLink>
                        </ListItem>
                        <ListItem disablePadding onClick={() => setMobileOpen(false)}>
                            <NavLink to="/download" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")} style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', textDecoration: 'none', padding: '10px 10px' }}>
                                <PhoneOutlined sx={{ fontSize: '24px' }} /> Downloads
                            </NavLink>
                        </ListItem>
                        <ListItem disablePadding onClick={() => setMobileOpen(false)} >
                            <NavLink to="/login" className={({ isActive }) => (isActive ? "landing-nav-link active" : "landing-nav-link")} style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', textDecoration: 'none', padding: '10px 10px' }}>
                                <Login sx={{ fontSize: '24px' }} /> Login
                            </NavLink>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </header>
    );
}
