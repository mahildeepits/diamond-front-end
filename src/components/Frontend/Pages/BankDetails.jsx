import { useState, useEffect } from "react";
import Banner from "../Pages/Banner";
import { Box, CardContent, Card, Typography, Grid, Container } from "@mui/material";
import { useFetchBankDetailsQuery } from "../../../store";
import { AccountBalanceOutlined, PersonOutline, NumbersOutlined, LocationOnOutlined, CodeOutlined } from '@mui/icons-material';
import { toast } from "react-toastify";

export default function BankDetails() {
    const [bankDetails, setBankDetails] = useState([]);
    const { data, isLoading, error } = useFetchBankDetailsQuery();

    useEffect(() => {
        if (data) {
            if (data.code == 200) {
                setBankDetails(data.data);
            } else {
                toast.error("Error while fetching bank details");
            }
        }
    }, [data, error]);

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            pb: 10,
            pt: { xs: 4, md: 8 }
        }}>
            <Container maxWidth="lg">
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
                        SECURE PAYMENTS
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
                        Our <span style={{ color: '#b79237' }}>Bank Details</span>
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#ccc', 
                            maxWidth: '600px', 
                            mx: 'auto',
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                        }}
                    >
                        Please use the following account details for all your bullion transactions. 
                        Ensure you double-check the account number and IFSC code before proceeding.
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

                {bankDetails.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            {isLoading ? "Loading bank details..." : "No Bank Details Found"}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {bankDetails.map((bank, index) => (
                            <Grid item xs={12} sm={8} md={6} lg={4} key={bank.id || index}>
                                <Card sx={{
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    '&:hover': {
                                        transform: 'translateY(-15px)',
                                        boxShadow: '0 20px 60px rgba(183, 146, 55, 0.3)',
                                        borderColor: 'rgba(183, 146, 55, 0.5)'
                                    },
                                    border: '1px solid rgba(183, 146, 55, 0.2)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: '#fff'
                                }}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #b79237 0%, #8e6c31 100%)',
                                        py: 4,
                                        px: 3,
                                        textAlign: 'center',
                                        color: '#fff',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <Box sx={{ 
                                            position: 'absolute', 
                                            top: -20, 
                                            right: -20, 
                                            opacity: 0.1,
                                            transform: 'rotate(15deg)'
                                        }}>
                                            <AccountBalanceOutlined sx={{ fontSize: '120px' }} />
                                        </Box>
                                        <AccountBalanceOutlined sx={{ fontSize: '48px', mb: 1.5, color: '#fdf6d4' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            {bank.bank_name}
                                        </Typography>
                                    </Box>
                                    
                                    <CardContent sx={{ p: { xs: 3, md: 4 }, flex: 1 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <DetailItem
                                                icon={<PersonOutline sx={{ color: '#b79237' }} />}
                                                label="Account Holder"
                                                value={bank.account_holder_name}
                                            />
                                            <DetailItem
                                                icon={<NumbersOutlined sx={{ color: '#b79237' }} />}
                                                label="Account Number"
                                                value={bank.account_number}
                                                isCopyable
                                            />
                                            <DetailItem
                                                icon={<LocationOnOutlined sx={{ color: '#b79237' }} />}
                                                label="Branch Name"
                                                value={bank.branch_name}
                                            />
                                            <DetailItem
                                                icon={<CodeOutlined sx={{ color: '#b79237' }} />}
                                                label="IFSC Code"
                                                value={bank.ifsc_code}
                                                isCopyable
                                            />
                                        </Box>
                                    </CardContent>
                                    
                                    <Box sx={{
                                        backgroundColor: '#fdfaf2',
                                        py: 2,
                                        textAlign: 'center',
                                        borderTop: '1px solid rgba(183, 146, 55, 0.1)'
                                    }}>
                                        <Typography variant="caption" sx={{ color: '#b79237', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Official Diamond Bullion House Account
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

function DetailItem({ icon, label, value, isCopyable = false }) {
    const handleCopy = () => {
        if (isCopyable) {
            navigator.clipboard.writeText(value);
            toast.success(`${label} copied!`, { autoClose: 1000, position: 'bottom-center' });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                cursor: isCopyable ? 'pointer' : 'default',
                '&:hover': isCopyable ? { transform: 'scale(1.02)' } : {},
                transition: 'transform 0.2s'
            }}
            onClick={handleCopy}
        >
            <Box sx={{
                backgroundColor: 'rgba(183, 146, 55, 0.1)',
                p: 1,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" sx={{ color: '#777', fontWeight: 500, display: 'block', mb: 0.2 }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', fontSize: '1rem' }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}