import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LiveRateApi from "../../utils/LiveRateApi";
import { io } from "socket.io-client";
import { useFetchBookingStatusQuery } from '../../store/apis/BookingsAPI';

export default function LiveRatesComponent({ setOpenBookingModal }) {
    const RATES_LATENCY = 500; // in milliseconds
    const StyledPrices = {
        high: {
            backgroundColor: "rgba(0, 255, 0, 0.6)",
            colos: 'white'
        },
        same: {
            backgroundColor: "transparent",
            color: 'inherit',
        },
        low: {
            backgroundColor: "rgba(255, 0, 0, 0.6)",
            color: 'white'
        }
    }

    const justifyPriceStyle = (previous, current) => {
        if(priceVisibility){
            if (previous === current) return StyledPrices.same;
            else if (previous > current) return StyledPrices.low;
            else if (previous < current) return StyledPrices.high;
        }
        return StyledPrices.same;
    }

    const [goldPrice, setGoldPrice] = useState({ previous: 0, current: 0 });
    const [usdInr, setUsdInr] = useState({ previous: 0, current: 0 });
    const [goldCost, setGoldCost] = useState({ previous: 0, current: 0 });
    const [goldCostTcs, setGoldCostTcs] = useState({ previous: 0, current: 0 });
    const [goldCostTds, setGoldCostTds] = useState({ previous: 0, current: 0 });
    const [nextMonthGoldCostTcs, setNextMonthGoldCostTcs] = useState({ previous: 0, current: 0 });
    const [nextMonthGoldCostTds, setNextMonthGoldCostTds] = useState({ previous: 0, current: 0 });
    const [nextMonthRateShow,setNextMonthRateShow] = useState(0);
    const [priceVisibility, setPriceVisibility] = useState(0);
    const { data, isLoading, error } = useFetchBookingStatusQuery();
    useEffect(() => {
        if (data) {
            if (data.code == 200) {
                setPriceVisibility(data.data.current_rate_status);
            }
            console.log(data,'visibility');
        }
    }, [data]);
    useEffect(() => {

        const interval = setInterval(async () => {

            const { rate, usd, cost, includingTcs, includingTds, nextMonthIncludingTcs, nextMonthIncludingTds,nextMonthRateStatus } = await LiveRateApi.fetch();

            setGoldPrice({ previous: goldPrice.current, current: rate });
            setUsdInr({ previous: usdInr.current, current: usd });
            setGoldCost({ previous: goldCost.current, current: cost });
            setGoldCostTcs({ previous: goldCostTcs.current, current: includingTcs });
            setGoldCostTds({ previous: goldCostTds.current, current: includingTds });
            setNextMonthGoldCostTcs({ previous: nextMonthGoldCostTcs.current, current: nextMonthIncludingTcs });
            setNextMonthGoldCostTds({ previous: nextMonthGoldCostTds.current, current: nextMonthIncludingTds });
            setNextMonthRateShow(nextMonthRateStatus);
        }, RATES_LATENCY)

        return () => {
            clearInterval(interval);
        };
    }, [goldCostTcs, goldCostTds, nextMonthGoldCostTcs, nextMonthGoldCostTds,nextMonthRateShow]);
    useEffect(() => {
        const socket = io(import.meta.env.VITE_LIVE_SERVER_URL);
        socket.on('bookingTimeChanged', (data) => {
            console.log('booking time',data);
            setPriceVisibility(data.manage_booking.current_rate_status);
        });
        socket.on('rateDifference', (data) => {
            // console.log(data.rate_difference);
            setGoldCostTcs({ previous: goldCostTcs.current, current: parseFloat(data.rate_difference.including_tcs) })
            setGoldCostTds({ previous: goldCostTds.current, current: parseFloat(data.rate_difference.including_tds) })
            setNextMonthGoldCostTcs({ previous: nextMonthGoldCostTcs.current, current: parseFloat(data.rate_difference.next_including_tcs) })
            setNextMonthGoldCostTds({ previous: nextMonthGoldCostTds.current, current: parseFloat(data.rate_difference.next_including_tds) })
            setNextMonthRateShow(data.rate_difference.next_month_rate_status);
        })
    }, [])
    const FormatPrice = (price) => {
        if(priceVisibility){
            return new Intl.NumberFormat("en-IN").format(parseFloat(price.toFixed(2)));
        }
        return 0;
    }

    return (
        <Box>
            <Box sx={{ mb: 2 }} >
                <Typography variant="pageHeading" >Live Market Rates</Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <Box onClick={() => setOpenBookingModal(true)} sx={{ background: 'white', p: 2, width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>Gold Cost</Typography>
                    <Typography style={{ fontSize: "18px", padding: "4px", borderRadius: "5px", ...justifyPriceStyle(goldPrice.previous, goldPrice.current) }}>{FormatPrice(goldPrice.current)}</Typography>
                </Box>

                <Box onClick={() => setOpenBookingModal(true)} sx={{ background: 'white', p: 2, width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>USD INR</Typography>
                    <Typography style={{ fontSize: "18px", padding: "4px", borderRadius: "5px", ...justifyPriceStyle(usdInr.previous, usdInr.current) }}>{FormatPrice(usdInr.current)}</Typography>
                </Box>

                <Box onClick={() => setOpenBookingModal(true)} sx={{ background: 'white', p: 2, width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>Gold</Typography>
                    <Typography style={{ fontSize: "18px", padding: "4px", borderRadius: "5px", ...justifyPriceStyle(goldCost.previous, goldCost.current) }}>{FormatPrice(goldCost.current)}</Typography>
                </Box>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <Box onClick={() => setOpenBookingModal(true)} sx={{ background: 'white', p: 2, width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>Gold Cost (TCS)</Typography>
                    <Typography style={{ fontSize: "18px", padding: "4px", borderRadius: "5px", ...justifyPriceStyle(goldCostTcs.previous, goldCostTcs.current) }}>{FormatPrice(goldCostTcs.current)}</Typography>
                </Box>

                <Box onClick={() => setOpenBookingModal(true)} sx={{ background: 'white', p: 2, width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>Gold Cost (TDS)</Typography>
                    <Typography style={{ fontSize: "18px", padding: "4px", borderRadius: "5px", ...justifyPriceStyle(goldCostTds.previous, goldCostTds.current) }}>{FormatPrice(goldCostTds.current)}</Typography>
                </Box>
            </Stack>
            {nextMonthRateShow == 1 && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <Box onClick={() => setOpenBookingModal(true)} sx={{ background: 'white', p: 2, width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography style={{ fontSize: "14px" }}>Next month</Typography>
                        <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>Gold Cost (TCS)</Typography>
                    </Box>
                    <Typography style={{ fontSize: "18px", padding: "4px", borderRadius: "5px", ...justifyPriceStyle(nextMonthGoldCostTcs.previous, nextMonthGoldCostTcs.current) }}>{FormatPrice(nextMonthGoldCostTcs.current)}</Typography>
                </Box>

                <Box onClick={() => setOpenBookingModal(true)} sx={{ background: 'white', p: 2, width: { xs: "100%", sm: "50%" }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography style={{ fontSize: "14px" }}>Next month</Typography>
                        <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>Gold Cost (TDS)</Typography>
                    </Box>
                    <Typography style={{ fontSize: "18px", padding: "4px", borderRadius: "5px", ...justifyPriceStyle(nextMonthGoldCostTds.previous, nextMonthGoldCostTds.current) }}>{FormatPrice(nextMonthGoldCostTds.current)}</Typography>
                </Box>
            </Stack>
            )}
        </Box>
    );
}