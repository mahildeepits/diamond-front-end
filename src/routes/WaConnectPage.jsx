import { Box, Button, Card, CardContent, Container, Typography, Chip, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import LoopIcon from '@mui/icons-material/Loop';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function WaConnect() {
    const [qrcode, setqrcode] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkStatus = useCallback(() => {
        setIsLoading(true);
        fetch(import.meta.env.VITE_LIVE_SERVER_URL + "api/v1/wa/status")
            .then(res => res.json())
            .then(res => {
                setIsConnected(res?.isConnected);
                if (!res?.isConnected) {
                    // Automatically fetch QR if not connected
                    fetchQRcode();
                } else {
                    setIsLoading(false);
                }
            }).catch(err => {
                console.error('Status check error:', err);
                setIsLoading(false);
            })
    }, []);

    const fetchQRcode = useCallback(() => {
        setIsLoading(true);
        fetch(import.meta.env.VITE_LIVE_SERVER_URL + "api/v1/wa/get/qr", {
            method: 'post'
        })
            .then(res => res.json())
            .then(res => {
                if (res?.data?.qrcode) {
                    setqrcode(res?.data?.qrcode);
                    setIsLoading(false);
                } else {
                    // If no QR code, it might be connecting or just not ready. Check actual status.
                    fetch(import.meta.env.VITE_LIVE_SERVER_URL + "api/v1/wa/status")
                        .then(r => r.json())
                        .then(r => {
                            if (r?.isConnected) {
                                setIsConnected(true);
                                setIsLoading(false);
                            } else {
                                // Still not connected and no QR. Try again in a few seconds.
                                setTimeout(() => {
                                    fetchQRcode();
                                }, 3000);
                            }
                        })
                        .catch(err => {
                            setIsLoading(false);
                        });
                }
            }).catch(res => {
                setIsLoading(false);
                console.error(res);
            });
    }, []);

    const logout = useCallback(() => {
        setIsLoading(true);
        fetch(import.meta.env.VITE_LIVE_SERVER_URL + "api/v1/wa/logout", { method: 'post' })
            .then(res => res.json())
            .then(() => {
                setIsConnected(false);
                setqrcode(null);
                // Start polling for QR code again
                fetchQRcode();
            })
            .catch(res => {
                setIsLoading(false);
                console.error(res);
            });
    }, [fetchQRcode]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    return (
        <Box sx={{ margin: "20px auto" }} >
            <Card sx={{ maxWidth: 600, mx: 'auto', boxShadow: 3 }}>
                <CardContent>
                    <Container maxWidth="sm" >
                        <Typography sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }} variant="h5" >
                            WhatsApp Connection Status
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            {isConnected ? (
                                <Chip
                                    icon={<CheckCircleOutlineIcon />}
                                    label="Connected Successfully"
                                    color="success"
                                    variant="filled"
                                    sx={{ fontSize: '1.1rem', py: 2.5, px: 2 }}
                                />
                            ) : (
                                <Chip
                                    icon={<ErrorOutlineIcon />}
                                    label="Not Connected"
                                    color="error"
                                    sx={{ fontSize: '1.1rem', py: 2.5, px: 2 }}
                                />
                            )}
                        </Box>

                        <Box sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    {isConnected ? (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body1" color="text.secondary">
                                                Your WhatsApp client is active and ready to send messages.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            {qrcode ? (
                                                <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 2, bgcolor: 'white' }}>
                                                    <img src={qrcode} alt="Scan to connect with whatsapp" style={{ width: 250, height: 250 }} />
                                                </Box>
                                            ) : (
                                                <Typography variant="subtitle1" color="warning.main">
                                                    WhatsApp isn't ready to connect yet. Try refreshing.
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <Button
                                startIcon={<LoopIcon />}
                                variant="contained"
                                onClick={checkStatus}
                                disabled={isLoading}
                            >
                                Refresh Status
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={logout}
                                disabled={isLoading}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Container>
                </CardContent>
            </Card>
        </Box>
    );
}