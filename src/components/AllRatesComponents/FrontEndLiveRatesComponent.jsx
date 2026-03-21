import { Box, Container, Grid, Grid2, Stack, Typography } from "@mui/material";
import '../Frontend/NewLandingPage/LandingStyle.css';
import { useEffect, useRef, useState } from "react";
import LiveRateApi from "../../utils/LiveRateApi";
import { io } from "socket.io-client";
import { useFetchBookingStatusQuery } from '../../store/apis/BookingsAPI';
import { useNavigate } from "react-router-dom";
import { Call, ContentCopyOutlined, CopyAllOutlined, CopyAllTwoTone, Login, LogoutOutlined, PaymentsOutlined } from '@mui/icons-material';
import { CopyIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function FrontEndLiveRatesComponent({ setOpenBookingModal }) {
    const navigate = useNavigate();
    const RATES_LATENCY = 500; // in milliseconds
    const [goldPrice, setGoldPrice] = useState({ previous: 0, current: 0 });
    const [usdInr, setUsdInr] = useState({ previous: 0, current: 0 });
    const [goldCost, setGoldCost] = useState({ previous: 0, current: 0 });
    const [goldCostTcs, setGoldCostTcs] = useState({ previous: 0, current: 0 });
    const [goldCostTds, setGoldCostTds] = useState({ previous: 0, current: 0 });
    const [nextMonthGoldCostTcs, setNextMonthGoldCostTcs] = useState({ previous: 0, current: 0 });
    const [nextMonthGoldCostTds, setNextMonthGoldCostTds] = useState({ previous: 0, current: 0 });
    const [nextMonthRateShow, setNextMonthRateShow] = useState(0);
    const [priceVisibility, setPriceVisibility] = useState(0);
    const [retailGoldRate, setRetailGoldRate] = useState({ previous: 0, current: 0 });
    const [retailGoldRateStatus, setRetailGoldRateStatus] = useState(0);
    const [contactInfo, setContactInfo] = useState({ contact: '9876543210', accountMng: '9876543210' });

    // Silver states
    const [silverPrice, setSilverPrice] = useState({ previous: 0, current: 0 });
    const [silverCost, setSilverCost] = useState({ previous: 0, current: 0 });
    const [silverCostTds, setSilverCostTds] = useState({ previous: 0, current: 0 });
    const [silverSpotHigh, setSilverSpotHigh] = useState(0);
    const [silverSpotLow, setSilverSpotLow] = useState(0);

    const [tcsNew, setTcsNew] = useState(0);
    const [tdsNew, setTdsNew] = useState(0);
    const [nextMonthTcsNew, setNextMonthTcsNew] = useState(0);
    const [nextMonthTdsNew, setNextMonthTdsNew] = useState(0);
    const [goldCostHigh, setGoldCostHigh] = useState(0);
    const [goldCostLow, setGoldCostLow] = useState(0);
    const [goldRateHigh, setGoldRateHigh] = useState(0);
    const [goldRateLow, setGoldRateLow] = useState(0);

    const [goldDirection, setGoldDirection] = useState('up');
    const [silverDirection, setSilverDirection] = useState('up');

    const latestGoldCost = useRef(0);
    useEffect(() => {
        latestGoldCost.current = goldCost.current;
    }, [goldCost.current]);

    const dummySpots = {
        goldSpotHigh: 5045.35, goldSpotLow: 5100.21,
        silverSpot: 125.15, silverSpotHigh: 152.35, silverSpotLow: 120.21,
        usdInrHigh: 92.35, usdInrLow: 89.21
    };

    const { data, isLoading, error } = useFetchBookingStatusQuery();

    useEffect(() => {
        if (data && data.code == 200) {
            setPriceVisibility(data.data.current_rate_status);
        }
    }, [data]);

    useEffect(() => {
        (async () => {
            const apiRes = await LiveRateApi.fetch();
            if (apiRes) {
                setTcsNew(apiRes.tcs);
                setTdsNew(apiRes.tds);
                setNextMonthTcsNew(apiRes.nextMonthTcs);
                setNextMonthTdsNew(apiRes.nextMonthTds);
                setGoldPrice({ previous: apiRes.cost, current: apiRes.cost });
                setUsdInr({ previous: apiRes.usd, current: apiRes.usd });
                setGoldCost({ previous: apiRes.rate, current: apiRes.rate });
                setGoldCostTcs({ previous: apiRes.includingTcs, current: apiRes.includingTcs });
                setGoldCostTds({ previous: apiRes.includingTds, current: apiRes.includingTds });
                setNextMonthGoldCostTcs({ previous: apiRes.nextMonthIncludingTcs, current: apiRes.nextMonthIncludingTcs });
                setNextMonthGoldCostTds({ previous: apiRes.nextMonthIncludingTds, current: apiRes.nextMonthIncludingTds });
                setNextMonthRateShow(apiRes.nextMonthRateStatus);

                if (apiRes.silverPrice) setSilverPrice({ previous: apiRes.silverPrice, current: apiRes.silverPrice });
                if (apiRes.silverCost) setSilverPrice({ previous: apiRes.silverCost, current: apiRes.silverCost });
                if (apiRes.silverRate) setSilverCost({ previous: apiRes.silverRate, current: apiRes.silverRate });
                if (apiRes.includingSilverTds) setSilverCostTds({ previous: apiRes.includingSilverTds, current: apiRes.includingSilverTds });

                setGoldCostHigh(apiRes.costHigh);
                setGoldCostLow(apiRes.costLow);
                setGoldRateHigh(apiRes.rateHigh);
                setGoldRateLow(apiRes.rateLow);

                if (apiRes.silverCostHigh) setSilverSpotHigh(apiRes.silverCostHigh);
                if (apiRes.silverCostLow) setSilverSpotLow(apiRes.silverCostLow);

                if (apiRes.retailGoldRate) setRetailGoldRate({ previous: apiRes.retailGoldRate, current: apiRes.retailGoldRate });
                if (apiRes.retailGoldRateStatus !== undefined) setRetailGoldRateStatus(apiRes.retailGoldRateStatus);

                if (apiRes.contact) {
                    setContactInfo({
                        contact: apiRes.contact.first_contact_number || '9876543210',
                        accountMng: apiRes.contact.first_booking_number || '9876543210'
                    });
                }
            }
        })()
    }, [])

    useEffect(() => {
        const socket = io(import.meta.env.VITE_LIVE_SERVER_URL);

        socket.on('bookingTimeChanged', (res) => {
            if (res?.manage_booking?.current_rate_status !== undefined) {
                setPriceVisibility(res.manage_booking.current_rate_status);
            }
        });
        socket.on('rates', (res) => {
            setGoldPrice(prev => ({ previous: prev.current, current: parseFloat(res.rates.goldCost) }));
            setUsdInr(prev => ({ previous: prev.current, current: parseFloat(res.rates.usd) }));
            setGoldCost(prev => ({ previous: prev.current, current: parseFloat(res.rates.goldRate) }));
            setGoldCostTcs(prev => ({ previous: prev.current, current: parseFloat(res.rates.tcsGoldRate) }));
            setGoldCostTds(prev => ({ previous: prev.current, current: parseFloat(res.rates.tdsGoldRate) }));
            setNextMonthGoldCostTcs(prev => ({ previous: prev.current, current: parseFloat(res.rates.nextMonthTcsGoldRate) }));
            setNextMonthGoldCostTds(prev => ({ previous: prev.current, current: parseFloat(res.rates.nextMonthTdsGoldRate) }));

            if (res.rates.silverCost) setSilverPrice(prev => ({ previous: prev.current, current: parseFloat(res.rates.silverCost) }));
            if (res.rates.silverRate) setSilverCost(prev => ({ previous: prev.current, current: parseFloat(res.rates.silverRate) }));
            if (res.rates.tdsSilverRate) setSilverCostTds(prev => ({ previous: prev.current, current: parseFloat(res.rates.tdsSilverRate) }));
            if (res.rates.retailGoldRate) setRetailGoldRate(prev => ({ previous: prev.current, current: parseFloat(res.rates.retailGoldRate) }));
        });
        socket.on('rateDifference', (res) => {
            if (res.rate_difference && res.rate_difference.retail_gold_rate_status !== undefined) {
                setRetailGoldRateStatus(res.rate_difference.retail_gold_rate_status);
            }
            setTcsNew(parseFloat(res.rate_difference.including_tcs));
            setTdsNew(parseFloat(res.rate_difference.including_tds));
            setNextMonthTcsNew(parseFloat(res.rate_difference.next_including_tcs));
            setNextMonthTdsNew(parseFloat(res.rate_difference.next_including_tds));
            setGoldCostTcs(prev => ({ previous: prev.current, current: latestGoldCost.current + parseFloat(res.rate_difference.including_tcs) }))
            setGoldCostTds(prev => ({ previous: prev.current, current: latestGoldCost.current + parseFloat(res.rate_difference.including_tds) }))
            setNextMonthGoldCostTcs(prev => ({ previous: prev.current, current: latestGoldCost.current + parseFloat(res.rate_difference.next_including_tcs) }))
            setNextMonthGoldCostTds(prev => ({ previous: prev.current, current: latestGoldCost.current + parseFloat(res.rate_difference.next_including_tds) }))
            setNextMonthRateShow(res.rate_difference.next_month_rate_status);
        })

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (goldCost.current > goldCost.previous && goldCost.previous !== 0) setGoldDirection('up');
        else if (goldCost.current < goldCost.previous && goldCost.previous !== 0) setGoldDirection('down');
    }, [goldCost]);

    useEffect(() => {
        if (silverPrice.current > silverPrice.previous && silverPrice.previous !== 0) setSilverDirection('up');
        else if (silverPrice.current < silverPrice.previous && silverPrice.previous !== 0) setSilverDirection('down');
    }, [silverPrice]);



    return (
        <Box>
            {/* <Box sx={{ mb: 2 }} > */}
            {/* <Typography variant="pageHeading" >Live Market Rates</Typography> */}
            {/* </Box> */}

            {/* Hero Section */}
            {/* <section className="landing-hero"> */}
            {/* <Container> */}
            {/* DESKTOP VIEW */}
            <Grid container spacing={2.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                {/* LEFT COLUMN */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box className="gold-card">
                        <Box>
                            <Typography className="card-title">Gold <span style={{ fontSize: '12px', fontWeight: 400, color: '#333' }}>24k | 999</span></Typography>
                            <Typography className="card-price">
                                <PriceDisplay prefix="₹" prev={goldCost.previous} curr={goldCost.current} visible={priceVisibility} flashBg forceShow /> <span className="card-unit">/gm</span>
                            </Typography>
                        </Box>
                        <Box className="card-footer-line" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'red', fontSize: '10px', marginRight: '4px' }}>●</span> Live Rate
                            </span>
                            {goldDirection === 'up' ? (
                                <span style={{ color: '#00cc00', fontSize: '16px' }}>▲</span>
                            ) : (
                                <span style={{ color: '#cc0000', fontSize: '16px' }}>▼</span>
                            )}
                        </Box>
                    </Box>

                    <Box className="silver-card">
                        <Box>
                            <Typography className="card-title">Silver <span style={{ fontSize: '12px', fontWeight: 400, color: '#333' }}>24k | 999</span></Typography>
                            <Typography className="card-price">
                                <PriceDisplay prefix="₹" prev={silverPrice.previous} curr={silverPrice.current} visible={priceVisibility} flashBg forceShow /> <span className="card-unit">/kg</span>
                            </Typography>
                        </Box>
                        <Box className="card-footer-line" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'red', fontSize: '10px', marginRight: '4px' }}>●</span> Live Rate
                            </span>
                            {silverDirection === 'up' ? (
                                <span style={{ color: '#00cc00', fontSize: '16px' }}>▲</span>
                            ) : (
                                <span style={{ color: '#cc0000', fontSize: '16px' }}>▼</span>
                            )}
                        </Box>
                    </Box>
                </Grid>

                {/* MIDDLE COLUMN (RIGHT in layout but item 2) */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box className="spot-card">
                        <Box className="spot-info">
                            <Typography className="spot-title">Gold Spot</Typography>
                            <Typography className="spot-price-text">
                                <PriceDisplay prev={goldPrice.previous} curr={goldPrice.current} visible={priceVisibility} flashBg />
                            </Typography>
                        </Box>
                        <Box className="spot-high-low">
                            <Typography className="spot-high">{goldRateHigh > 0 ? goldRateHigh : dummySpots.goldSpotHigh} ▲</Typography>
                            <Typography className="spot-low">{goldRateLow > 0 ? goldRateLow : dummySpots.goldSpotLow} ▼</Typography>
                        </Box>
                    </Box>

                    <Box className="spot-card">
                        <Box className="spot-info">
                            <Typography className="spot-title">Silver Spot</Typography>
                            <Typography className="spot-price-text">
                                <PriceDisplay prev={silverCost.previous} curr={silverCost.current} visible={priceVisibility} flashBg defaultVal={dummySpots.silverSpot} />
                            </Typography>
                        </Box>
                        <Box className="spot-high-low">
                            <Typography className="spot-high">{silverSpotHigh > 0 ? silverSpotHigh : dummySpots.silverSpotHigh} ▲</Typography>
                            <Typography className="spot-low">{silverSpotLow > 0 ? silverSpotLow : dummySpots.silverSpotLow} ▼</Typography>
                        </Box>
                    </Box>

                    <Box className="spot-card">
                        <Box className="spot-info">
                            <Typography className="spot-title">INR Spot</Typography>
                            <Typography className="spot-price-text">
                                <PriceDisplay prev={usdInr.previous} curr={usdInr.current} visible={priceVisibility} flashBg />
                            </Typography>
                        </Box>
                        <Box className="spot-high-low">
                            <Typography className="spot-high">{dummySpots.usdInrHigh} ▲</Typography>
                            <Typography className="spot-low">{dummySpots.usdInrLow} ▼</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* RIGHT COLUMN */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Gold TDS Card */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '19px 18px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #b79237',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        width: '100%'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PaymentsOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>TDS Price (99.50)</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>Gold Cost</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
                                <PriceDisplay prefix="₹" prev={goldCostTds.previous} curr={goldCostTds.current} visible={priceVisibility} flashBg />
                            </Typography>
                        </Box>
                    </Box>

                    {/* Silver TDS Card */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '19px 18px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #b79237',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        width: '100%'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PaymentsOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>TDS Price (99.50)</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>Silver Cost</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
                                <PriceDisplay prefix="₹" prev={silverCostTds.previous} curr={silverCostTds.current} visible={priceVisibility} flashBg />
                            </Typography>
                        </Box>
                    </Box>

                    {/* Retail Gold TDS Card */}
                    {!!retailGoldRateStatus && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '19px 18px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #b79237',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            width: '100%'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PaymentsOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>TDS Price (99.50)</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>Retail Gold</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
                                    <PriceDisplay prefix="₹" prev={retailGoldRate.previous} curr={retailGoldRate.current} visible={priceVisibility && retailGoldRateStatus} flashBg />
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* MOBILE VIEW (APP LIKE) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', width: '100%', gap: '16px' }} className="app-mobile-view">
                {/* Live Rates Row */}
                <div className="app-live-rates-row">
                    <div className="app-rate-card app-gold-card">
                        <div className="app-rate-header">
                            <span className="app-metal-name">Gold <span className="app-purity">24k | 999</span></span>
                        </div>
                        <div className="app-rate-price">
                            <PriceDisplay prefix="₹" prev={goldCost.previous} curr={goldCost.current} visible={priceVisibility} flashBg forceShow /> <span className="app-unit">/gm</span>
                        </div>
                        <div className="app-rate-footer">
                            <div className="app-live-tag"><span className="app-dot red"></span> Live Rate</div>
                            <div className={`app-change-tag ${goldDirection}`}>{goldDirection === 'up' ? '▲' : '▼'}</div>
                        </div>
                    </div>
                    <div className="app-rate-card app-silver-card">
                        <div className="app-rate-header">
                            <span className="app-metal-name">Silver <span className="app-purity">24k | 999</span></span>
                        </div>
                        <div className="app-rate-price">
                            <PriceDisplay prefix="₹" prev={silverPrice.previous} curr={silverPrice.current} visible={priceVisibility} flashBg forceShow /> <span className="app-unit">/kg</span>
                        </div>
                        <div className="app-rate-footer">
                            <div className="app-live-tag"><span className="app-dot red"></span> Live Rate</div>
                            <div className={`app-change-tag ${silverDirection}`}>{silverDirection === 'up' ? '▲' : '▼'}</div>
                        </div>
                    </div>
                </div>

                {/* Spot Grid */}
                <div className="app-spot-grid">
                    <div className="app-spot-box">
                        <span className="app-spot-title">Gold Spot ($)</span>
                        <span className="app-spot-price app-gold-text"><PriceDisplay prev={goldPrice.previous} curr={goldPrice.current} visible={priceVisibility} flashBg /></span>
                        <div className="app-spot-range">
                            <span>{goldRateLow > 0 ? goldRateLow : dummySpots.goldSpotLow}</span>
                            <span>{goldRateHigh > 0 ? goldRateHigh : dummySpots.goldSpotHigh}</span>
                        </div>
                    </div>
                    <div className="app-spot-box">
                        <span className="app-spot-title">Silver Spot ($)</span>
                        <span className="app-spot-price app-green-bg-text"><PriceDisplay prev={silverCost.previous} curr={silverCost.current} visible={priceVisibility} flashBg defaultVal={dummySpots.silverSpot} /></span>
                        <div className="app-spot-range">
                            <span>{silverSpotLow > 0 ? silverSpotLow : dummySpots.silverSpotLow}</span>
                            <span>{silverSpotHigh > 0 ? silverSpotHigh : dummySpots.silverSpotHigh}</span>
                        </div>
                    </div>
                    <div className="app-spot-box">
                        <span className="app-spot-title">INR Spot</span>
                        <span className="app-spot-price app-normal-text"><PriceDisplay prev={usdInr.previous} curr={usdInr.current} visible={priceVisibility} flashBg /></span>
                        <div className="app-spot-range">
                            <span>{dummySpots.usdInrLow}</span>
                            <span>{dummySpots.usdInrHigh}</span>
                        </div>
                    </div>
                </div>

                {/* TDS and Contact Boxes for Mobile */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #b79237',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        width: '100%'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PaymentsOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>TDS Price (99.50)</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>Gold Cost</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
                                <PriceDisplay prefix="₹" prev={goldCostTds.previous} curr={goldCostTds.current} visible={priceVisibility} flashBg />
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #b79237',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        width: '100%'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PaymentsOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>TDS Price (99.50)</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>Silver Cost</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
                                <PriceDisplay prefix="₹" prev={silverCostTds.previous} curr={silverCostTds.current} visible={priceVisibility} flashBg />
                            </Typography>
                        </Box>
                    </Box>

                    {!!retailGoldRateStatus && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '18px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #b79237',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            width: '100%'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PaymentsOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>TDS Price (99.50)</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>Retail Gold</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
                                    <PriceDisplay prefix="₹" prev={retailGoldRate.previous} curr={retailGoldRate.current} visible={priceVisibility && retailGoldRateStatus} flashBg />
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #b79237',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        width: '100%'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Call sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>Contact</Typography>
                                <Typography sx={{ fontSize: '1rem', color: '#000000', fontWeight: 700 }}>+91 {contactInfo.contact}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* </Container> */}
            {/* </section> */}
        </Box>

    );
}

function PriceDisplay({ curr, visible, flashBg = false, defaultVal = 0, prefix = '', forceShow = false }) {
    const [bgColor, setBgColor] = useState('transparent');
    const [txtColor, setTxtColor] = useState('inherit');
    const prevValue = useRef(curr);

    const renderValue = curr === 0 ? defaultVal : curr;

    useEffect(() => {
        if (visible || forceShow) {
            if (curr > prevValue.current && prevValue.current !== 0) {
                if (flashBg) {
                    setBgColor('rgba(61, 197, 96, 0.9)');
                    setTxtColor('#fff');
                } else {
                    setTxtColor('#3dc560');
                }
            } else if (curr < prevValue.current && prevValue.current !== 0) {
                if (flashBg) {
                    setBgColor('rgba(193, 67, 60, 0.9)');
                    setTxtColor('#fff');
                } else {
                    setTxtColor('#c1433c');
                }
            }

            const timer = setTimeout(() => {
                setBgColor('transparent');
                setTxtColor('inherit');
            }, 1000);
            return () => clearTimeout(timer);
        }
        prevValue.current = curr;
    }, [curr, visible, flashBg, forceShow]);

    if (!visible && !forceShow) return <span>--</span>;

    const formatted = new Intl.NumberFormat("en-IN").format(parseFloat(renderValue.toFixed(2)));

    return (
        <span
            className={flashBg ? "price-flash" : ""}
            style={{
                backgroundColor: bgColor,
                color: txtColor,
                transition: 'background-color 0.1s ease',
                display: 'inline-block'
            }}
        >
            {prefix}{formatted}
        </span>
    );
}
