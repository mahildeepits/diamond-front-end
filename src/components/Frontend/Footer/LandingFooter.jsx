import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LongLogoImg from '../../../assets/images/logo-hori.png';
import '../NewLandingPage/LandingStyle.css';
import { useFetchAdminContactDetailsQuery } from '../../../store/apis/AdminAPI';

export default function LandingFooter() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const { data: contactData } = useFetchAdminContactDetailsQuery();
    const contact = contactData?.data || {};

    return (
        <footer className="landing-footer">
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <img src={LongLogoImg} alt="Diamond Bullion" className="footer-logo" />
                        <Typography className="footer-text" >
                            {contact.address || 'Amritsar, Punjab 143001'}
                        </Typography>
                        <Box className="footer-socials" sx={{ display: 'flex', gap: '20px', mt: '20px' }}>
                            <span style={{ fontSize: '32px', cursor: 'pointer' }}><b>f</b></span>
                            <span style={{ fontSize: '32px', cursor: 'pointer' }}><b>𝕏</b></span>
                            <span style={{ fontSize: '32px', cursor: 'pointer' }}><b>▶</b></span>
                            <span style={{ fontSize: '32px', cursor: 'pointer' }}><b>in</b></span>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography className="footer-col-title">QUICK LINKS</Typography>
                        <ul className="footer-links">
                            <li><Link to="/" onClick={scrollToTop}>Live Rates</Link></li>
                            {/* <li><Link to="/contactus" onClick={scrollToTop}>Contact Us</Link></li> */}
                            <li><Link to="/bankdetails" onClick={scrollToTop}>Bank Details</Link></li>
                            <li><Link to="/download" onClick={scrollToTop}>Download</Link></li>
                            <li><Link to="/aboutus" onClick={scrollToTop}>About Us</Link></li>
                        </ul>
                    </Grid>

                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'center' }}>
                        <Box className="contact-btn-box" sx={{ width: '300px!important', fontSize: '18px!important' }}>
                            CONTACT US
                        </Box>
                        <Typography className="contact-number" sx={{ fontSize: '36px!important' }}>+91 {contact.first_contact_number || '+91-9876543210'}</Typography>
                    </Grid>
                </Grid>

                <Box className="footer-bottom">
                    ©2026 Diamond Bullions Gold House
                </Box>
            </Container>
        </footer>
    );
}
