import React, { useState } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { Delete, Edit, Add, CloudUpload } from "@mui/icons-material";
import {
    useFetchGoldCoinRatesQuery,
    useAddGoldCoinRateMutation,
    useDeleteGoldCoinRateMutation
} from "../../store";
import { toast } from "react-toastify";

export default function CoinRatesComponent() {
    const { data: coinRatesData, isLoading } = useFetchGoldCoinRatesQuery();
    const [addGoldCoinRate, { isLoading: isSaving }] = useAddGoldCoinRateMutation();
    const [deleteGoldCoinRate] = useDeleteGoldCoinRateMutation();

    const coinRates = coinRatesData?.data || [];

    const [open, setOpen] = useState(false);
    const [editingCoin, setEditingCoin] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        grams: "",
        disparity: "",
        metal_type: "Gold",
        image: null,
    });

    const handleOpen = (coin = null) => {
        if (coin) {
            setEditingCoin(coin);
            setFormData({
                title: coin.title,
                grams: coin.grams || coin.qty || "",
                disparity: coin.disparity || coin.amount || "",
                metal_type: coin.metal_type || "Gold",
                image: null,
            });
        } else {
            setEditingCoin(null);
            setFormData({
                title: "",
                grams: "",
                disparity: "",
                metal_type: "Gold",
                image: null,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCoin(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        if (editingCoin?.id) form.append("id", editingCoin.id);
        form.append("title", formData.title);
        form.append("grams", formData.grams);
        form.append("disparity", formData.disparity);
        form.append("metal_type", formData.metal_type);
        if (formData.image instanceof File) {
            form.append("image", formData.image);
        }

        try {
            const res = await addGoldCoinRate(form).unwrap();
            if (res.status) {
                toast.success(res.message || "Coin rate saved successfully");
                handleClose();
            }
        } catch (error) {
            toast.error(error.data?.message || "Error saving coin rate");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this coin?")) {
            try {
                const res = await deleteGoldCoinRate(id).unwrap();
                if (res.status) {
                    toast.success(res.message || "Coin rate deleted successfully");
                }
            } catch (error) {
                toast.error(error.data?.message || "Error deleting coin rate");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    Coin Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    Add New Coin
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "rgba(209, 161, 74, 0.1)" }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Metal</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grams</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Disparity (per gm)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress size={24} sx={{ my: 2 }} />
                                </TableCell>
                            </TableRow>
                        ) : coinRates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Box py={3}>No coins found</Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            coinRates.map((coin) => (
                                <TableRow key={coin.id} hover>
                                    <TableCell>
                                        {coin.image && (
                                            <img
                                                src={coin.image}
                                                alt={coin.title}
                                                style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: '4px' }}
                                                onError={(e) => { e.target.src = '/images/gold-coin.png' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: coin.metal_type === "Gold" ? "#DAA520" : "#A9A9A9",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {coin.metal_type || "Gold"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{coin.title}</TableCell>
                                    <TableCell>{coin.grams || coin.qty}g</TableCell>
                                    <TableCell>₹{coin.disparity || coin.amount}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpen(coin)} size="small">
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(coin.id)} size="small">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>{editingCoin ? "Edit Coin" : "Add New Coin"}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Metal Type</InputLabel>
                                    <Select
                                        value={formData.metal_type}
                                        label="Metal Type"
                                        onChange={(e) => setFormData({ ...formData, metal_type: e.target.value })}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        <MenuItem value="Gold">Gold</MenuItem>
                                        <MenuItem value="Silver">Silver</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Coin Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Weight (Grams)"
                                    type="number"
                                    inputProps={{ step: "0.001" }}
                                    value={formData.grams}
                                    onChange={(e) => setFormData({ ...formData, grams: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Disparity (Rate per gm)"
                                    type="number"
                                    value={formData.disparity}
                                    onChange={(e) => setFormData({ ...formData, disparity: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    startIcon={<CloudUpload />}
                                    sx={{ py: 1.5, borderStyle: 'dashed' }}
                                >
                                    {formData.image ? "Change Image" : "Upload Coin Image"}
                                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </Button>
                                {formData.image && (
                                    <Typography variant="caption" display="block" mt={1} color="primary">
                                        Selected: {formData.image.name}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose} color="inherit">Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSaving}
                            sx={{ minWidth: 120 }}
                        >
                            {isSaving ? <CircularProgress size={24} color="inherit" /> : editingCoin ? "Update" : "Save"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
