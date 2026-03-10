import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Alert,
    Snackbar,
} from '@mui/material';
import { Send as SendIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFetchNotificationsQuery, useSendNotificationMutation } from '../../store';
import BreadcrumbsComponent from '../../components/BreadcrumbsComponent/BreadcrumbsComponent';

const NotificationsPage = () => {
    const [formData, setFormData] = useState({ title: '', message: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { data: notificationsData, isLoading: isFetching, refetch } = useFetchNotificationsQuery();
    const [sendNotification, { isLoading: isSending }] = useSendNotificationMutation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) return;

        try {
            const res = await sendNotification(formData).unwrap();
            if (res.status) {
                setSnackbar({ open: true, message: 'Notification sent successfully!', severity: 'success' });
                setFormData({ title: '', message: '' });
                refetch();
            }
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to send notification', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // Notifications data from backend is grouped by date (Today, Yesterday, etc.)
    // We need to flatten it for the table or display it grouped
    const groupedNotifications = notificationsData?.data || {};

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 2 }}>
                <BreadcrumbsComponent breadcrumbs={[<Typography key={1}>Broadcast Notifications</Typography>]} />
            </Box>

            <Grid container spacing={4}>
                {/* Send Section */}
                <Grid item xs={12} md={5}>
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                Send New Notification
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Notification Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Notification Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isSending}
                                    startIcon={isSending ? <CircularProgress size={20} /> : <SendIcon />}
                                    sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                                >
                                    {isSending ? 'Sending...' : 'Send to All Users'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* History Section */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom color="secondary">
                        Notification History
                    </Typography>
                    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, maxHeight: 600 }}>
                        {isFetching ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(groupedNotifications)
                                        .filter(([_, items]) => Array.isArray(items))
                                        .map(([group, items]) => (
                                            <React.Fragment key={group}>
                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                    <TableCell colSpan={3} sx={{ fontWeight: 'bold', py: 1 }}>
                                                        {group}
                                                    </TableCell>
                                                </TableRow>
                                                {items.map((notif) => (
                                                    <TableRow key={notif.id} hover>
                                                        <TableCell sx={{ fontWeight: 500 }}>{notif.title}</TableCell>
                                                        <TableCell>{notif.message ?? notif.body}</TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                            {notif.created_at ? new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    {Object.keys(groupedNotifications).length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                                No notifications sent yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default NotificationsPage;
