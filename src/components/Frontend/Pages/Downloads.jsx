import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper } from "@mui/material";
import MobileImg from "../../../assets/images/mobile-mockup.png";
import PlayStoreImg from "../../../assets/images/play_store.png";
import AppStoreImg from "../../../assets/images/app_store.png";
import { SecurityOutlined, SpeedOutlined, PhoneIphoneOutlined } from '@mui/icons-material';

export default function Downloads() {
    return (
        <Box sx={{
            minHeight: '100vh',
            pb: 10,
            pt: { xs: 4, md: 8 }
        }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#b79237',
                            fontWeight: 700,
                            letterSpacing: '3px',
                            display: 'block',
                            mb: 1
                        }}
                    >
                        CONNECT ON THE GO
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            color: '#fff',
                            fontSize: { xs: '2rem', md: '3.5rem' },
                            mb: 2
                        }}
                    >
                        Our <span style={{ color: '#b79237' }}>Mobile App</span>
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#ccc',
                            maxWidth: '700px',
                            mx: 'auto',
                            fontSize: '1.1rem',
                            lineHeight: 1.7
                        }}
                    >
                        Take the power of Diamond Bullion with you. Get real-time rates and instant booking features right on your smartphone.
                    </Typography>
                    <Box sx={{
                        width: '80px',
                        height: '4px',
                        backgroundColor: '#b79237',
                        mx: 'auto',
                        mt: 4,
                        borderRadius: '2px'
                    }} />
                </Box>

                <Grid container spacing={8} alignItems="center">
                    {/* Left Side: Mobile Mockup */}
                    <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                            {/* Decorative background effects */}
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: { xs: '250px', md: '350px' },
                                height: { xs: '250px', md: '350px' },
                                backgroundColor: 'rgba(183, 146, 55, 0.15)',
                                filter: 'blur(60px)',
                                borderRadius: '50%',
                                zIndex: 0
                            }} />
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: { xs: '200px', md: '300px' },
                                height: { xs: '200px', md: '300px' },
                                border: '1px dashed rgba(183, 146, 55, 0.4)',
                                borderRadius: '50%',
                                zIndex: 0,
                                animation: 'spin 20s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                                    '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
                                }
                            }} />

                            <img
                                src={MobileImg}
                                alt="Mobile App"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    position: 'relative',
                                    zIndex: 1,
                                    filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))'
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Right Side: Content & Buttons */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: '32px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(183, 146, 55, 0.25)',
                            color: '#fff',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                        }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    mb: 3,
                                    fontSize: { xs: '1.8rem', md: '2.2rem' }
                                }}
                            >
                                Experience Pure Trading <br />
                                <span style={{ color: '#b79237' }}>On Your Fingertips</span>
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#eee',
                                    fontSize: '1.1rem',
                                    mb: 6,
                                    lineHeight: 1.8
                                }}
                            >
                                Get real-time live rates, instant booking notifications, and secure management
                                of your precious metal portfolio. Download the Diamond Bullion app today for
                                a seamless trading experience.
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 3,
                                mb: 6,
                                flexWrap: 'wrap'
                            }}>
                                <a href="https://play.google.com/store/apps/details?id=com.ansh_jewellers.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <Box sx={{
                                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': { transform: 'scale(1.1) translateY(-5px)' }
                                    }}>
                                        <img src={PlayStoreImg} alt="Get it on Play Store" style={{ height: '54px' }} />
                                    </Box>
                                </a>
                                <a href="https://apps.apple.com/us/app/ansh-jewellers/id6739967815" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <Box sx={{
                                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': { transform: 'scale(1.1) translateY(-5px)' }
                                    }}>
                                        <img src={AppStoreImg} alt="Download on App Store" style={{ height: '54px' }} />
                                    </Box>
                                </a>
                            </Box>

                            <Grid container spacing={3}>
                                <FeatureItem
                                    icon={<SecurityOutlined />}
                                    title="Secure Trading"
                                    desc="Bank-level security for transactions"
                                />
                                <FeatureItem
                                    icon={<SpeedOutlined />}
                                    title="Live Updates"
                                    desc="Real-time rates directly from market"
                                />
                                <FeatureItem
                                    icon={<PhoneIphoneOutlined />}
                                    title="Easy Access"
                                    desc="Trade anywhere, anytime effortlessly"
                                />
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function FeatureItem({ icon, title, desc }) {
    return (
        <Grid item xs={12} sm={4}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 2.5,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.5)', // Solid light background for black text visibility
                border: '1px solid rgba(183, 146, 55, 0.3)',
                height: '100%',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: '#ffffff'
                }
            }}>
                <Box sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Light black background
                    p: 1.2,
                    borderRadius: '12px',
                    display: 'flex',
                    width: 'fit-content'
                }}>
                    {React.cloneElement(icon, { sx: { color: '#000000', fontSize: '24px' } })}
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000', fontSize: '1rem', mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#444444', lineHeight: 1.5, fontSize: '0.8rem', fontWeight: 500 }}>
                    {desc}
                </Typography>
            </Box>
        </Grid>
    );
}
