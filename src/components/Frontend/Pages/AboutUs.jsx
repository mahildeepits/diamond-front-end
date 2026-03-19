import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { VisibilityOutlined, TrackChangesOutlined, DiamondOutlined } from '@mui/icons-material';

export default function AboutUs() {
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
                        OUR STORY
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
                        About <span style={{ color: '#b79237' }}>Diamond Bullion</span>
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
                        Learn about our legacy of trust, purity, and excellence in the bullion and jewellery industry.
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

                <Grid container spacing={4}>
                    {/* Vision & Mission Cards */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 4, 
                            height: '100%', 
                            borderRadius: '24px', 
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(183, 146, 55, 0.2)',
                            color: '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderColor: '#b79237'
                            }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                <Box sx={{ 
                                    backgroundColor: 'rgba(183, 146, 55, 0.2)', 
                                    p: 1.5, 
                                    borderRadius: '12px',
                                    display: 'flex'
                                }}>
                                    <VisibilityOutlined sx={{ color: '#fdf6d4', fontSize: '32px' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>Our Vision</Typography>
                            </Box>
                            <Typography sx={{ color: '#ccc', lineHeight: 1.7, fontSize: '1.05rem' }}>
                                To be the most reputed and respected bullion dealer in India, setting benchmarks for quality, 
                                integrity, and customer satisfaction in the precious metals market.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 4, 
                            height: '100%', 
                            borderRadius: '24px', 
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(183, 146, 55, 0.2)',
                            color: '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderColor: '#b79237'
                            }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                <Box sx={{ 
                                    backgroundColor: 'rgba(183, 146, 55, 0.2)', 
                                    p: 1.5, 
                                    borderRadius: '12px',
                                    display: 'flex'
                                }}>
                                    <TrackChangesOutlined sx={{ color: '#fdf6d4', fontSize: '32px' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>Our Mission</Typography>
                            </Box>
                            <Typography sx={{ color: '#ccc', lineHeight: 1.7, fontSize: '1.05rem' }}>
                                To give the best satisfaction and services to our clients with assured quality of precious metals, 
                                assured delivery, most competitive price, and honest & transparent dealings.
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Main About Us Content */}
                    <Grid item xs={12} sx={{ mt: 4 }}>
                        <Paper sx={{ 
                            p: { xs: 4, md: 8 }, 
                            borderRadius: '32px', 
                            background: '#fff',
                            color: '#333',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ 
                                position: 'absolute', 
                                top: -40, 
                                right: -40, 
                                opacity: 0.05,
                                transform: 'rotate(15deg)'
                            }}>
                                <DiamondOutlined sx={{ fontSize: '300px' }} />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 800, 
                                    color: '#b79237',
                                    textTransform: 'uppercase',
                                    fontSize: { xs: '1.8rem', md: '2.5rem' }
                                }}>
                                    About Us
                                </Typography>
                            </Box>

                            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.9, fontSize: '1.15rem' }}>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    At <b>Diamond Bullion Gold House</b>, we are committed to excellence, purity, and trust. 
                                    As a distinguished name in fine jewellery and bullion trading, we specialize in premium gold, 
                                    silver, and certified diamond products designed to meet both lifestyle and investment needs.
                                </p>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Our foundation is built on transparency, integrity, and long-term customer relationships. 
                                    We understand that jewellery is more than an accessory—it represents milestones, emotions, 
                                    heritage, and financial security. That is why every piece we offer reflects superior 
                                    craftsmanship and uncompromising quality standards.
                                </p>
                                <p>
                                    Whether you are looking for a timeless piece of jewellery or seeking a secure investment 
                                    in bullion, Diamond Bullion Gold House is your trusted partner. We strive to provide 
                                    the best services and satisfaction to our clients through a professional approach, 
                                    hard work, and customer-friendly dealings.
                                </p>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
