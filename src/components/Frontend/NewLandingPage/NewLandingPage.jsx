import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Icon, Typography, Drawer, IconButton, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { io } from "socket.io-client";
import LiveRateApi from "../../../utils/LiveRateApi";
import { useFetchBookingStatusQuery } from '../../../store/apis/BookingsAPI';
import './LandingStyle.css';

// Using actual image paths
import LogoImg from '../../../assets/images/dbh.png';
import MobileImg from '../../../assets/images/mobile-mockup.png';
import PlayStoreImg from '../../../assets/images/play_store.png';
import AppStoreImg from '../../../assets/images/app_store.png';
import GoldImg from '../../../assets/images/buy-gold-icon.png';
import SilverImg from '../../../assets/images/buy-silver-icon.png';
import CoinImg from '../../../assets/images/buy-coinbar-icon.png';
import HeroLogoImg from '../../../assets/images/hero-logo.png';
import LandingHeader from '../Header/LandingHeader';
import LandingFooter from '../Footer/LandingFooter';
import MenuIcon from '@mui/icons-material/Menu';
import { Call, ContentCopyOutlined, PaymentsOutlined, SellOutlined } from '@mui/icons-material';
import { toast } from "react-toastify";

export default function NewLandingPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [priceVisibility, setPriceVisibility] = useState(1);
    const { data: bookingStatusData } = useFetchBookingStatusQuery();

    const [goldPrice, setGoldPrice] = useState({ previous: 0, current: 0 });
    const [silverPrice, setSilverPrice] = useState({ previous: 0, current: 0 });
    const [usdInr, setUsdInr] = useState({ previous: 0, current: 0 });
    const [goldCost, setGoldCost] = useState({ previous: 0, current: 0 });
    const [silverCost, setSilverCost] = useState({ previous: 0, current: 0 });
    const [goldCostTds, setGoldCostTds] = useState({ previous: 0, current: 0 });
    const [silverCostTds, setSilverCostTds] = useState({ previous: 0, current: 0 });

    const [goldRateHigh, setGoldRateHigh] = useState(0);
    const [goldRateLow, setGoldRateLow] = useState(0);
    const [goldCostHigh, setGoldCostHigh] = useState(0);
    const [goldCostLow, setGoldCostLow] = useState(0);

    const [silverSpotHigh, setSilverSpotHigh] = useState(0);
    const [silverSpotLow, setSilverSpotLow] = useState(0);

    const [goldDirection, setGoldDirection] = useState('up');
    const [silverDirection, setSilverDirection] = useState('up');

    // Dummy values for spots if not available yet from API
    const dummySpots = {
        goldSpotHigh: 5045.35, goldSpotLow: 5100.21,
        silverSpot: 125.15, silverSpotHigh: 152.35, silverSpotLow: 120.21,
        usdInrHigh: 92.35, usdInrLow: 89.21
    };

    useEffect(() => {
        if (bookingStatusData && bookingStatusData.code === 200) {
            setPriceVisibility(bookingStatusData.data.current_rate_status);
        }
    }, [bookingStatusData]);

    useEffect(() => {
        (async () => {
            const apiRes = await LiveRateApi.fetch();
            if (apiRes) {
                setGoldPrice({ previous: apiRes.cost, current: apiRes.cost });
                setUsdInr({ previous: apiRes.usd, current: apiRes.usd });
                setGoldCost({ previous: apiRes.rate, current: apiRes.rate });
                if (apiRes.includingTds) setGoldCostTds({ previous: apiRes.includingTds, current: apiRes.includingTds });

                setGoldRateHigh(apiRes.rateHigh);
                setGoldRateLow(apiRes.rateLow);
                setGoldCostHigh(apiRes.costHigh);
                setGoldCostLow(apiRes.costLow);

                if (apiRes.silverCostHigh) setSilverSpotHigh(apiRes.silverCostHigh);
                if (apiRes.silverCostLow) setSilverSpotLow(apiRes.silverCostLow);
            }
        })();

        const socket = io(import.meta.env.VITE_LIVE_SERVER_URL);
        socket.on('bookingTimeChanged', (res) => {
            if (res?.manage_booking?.current_rate_status !== undefined) {
                setPriceVisibility(res.manage_booking.current_rate_status);
            }
        });

        socket.on('rates', (res) => {
            if (res.rates) {
                setGoldPrice(prev => ({ previous: prev.current, current: parseFloat(res.rates.goldCost || 0) }));
                setUsdInr(prev => ({ previous: prev.current, current: parseFloat(res.rates.usd || 0) }));
                setGoldCost(prev => ({ previous: prev.current, current: parseFloat(res.rates.goldRate || 0) }));
                if (res.rates.tdsGoldRate) setGoldCostTds(prev => ({ previous: prev.current, current: parseFloat(res.rates.tdsGoldRate) }));

                if (res.rates.silverCost) setSilverPrice(prev => ({ previous: prev.current, current: parseFloat(res.rates.silverCost) }));
                if (res.rates.silverRate) setSilverCost(prev => ({ previous: prev.current, current: parseFloat(res.rates.silverRate) }));
                if (res.rates.tdsSilverRate) setSilverCostTds(prev => ({ previous: prev.current, current: parseFloat(res.rates.tdsSilverRate) }));
            }
        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (goldCost.current > goldCost.previous && goldCost.previous !== 0) setGoldDirection('up');
        else if (goldCost.current < goldCost.previous && goldCost.previous !== 0) setGoldDirection('down');
    }, [goldCost]);

    useEffect(() => {
        if (silverPrice.current > silverPrice.previous && silverPrice.previous !== 0) setSilverDirection('up');
        else if (silverPrice.current < silverPrice.previous && silverPrice.previous !== 0) setSilverDirection('down');
    }, [silverPrice]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <React.Fragment>
            {/* Header */}
            <LandingHeader />


            {/* Hero Section */}
            <section className="landing-hero">
                <Container>
                    {/* DESKTOP VIEW */}
                    <Grid container spacing={2.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {/* LEFT COLUMN */}
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Box className="gold-card">
                                <Box>
                                    <Typography className="card-title">Gold <span style={{ fontSize: '12px', fontWeight: 400, color: '#333' }}>24k | 999</span></Typography>
                                    <Typography className="card-price">
                                        ₹ <PriceDisplay prev={goldCost.previous} curr={goldCost.current} visible={priceVisibility} flashBg /> <span className="card-unit">/gm</span>
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
                                        ₹ <PriceDisplay prev={silverPrice.previous} curr={silverPrice.current} visible={priceVisibility} flashBg /> <span className="card-unit">/kg</span>
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


                        {/* RIGHT COLUMN */}
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
                                    <Typography className="spot-title">USD INR</Typography>
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
                        {/* MIDDLE COLUMN */}
                        <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: '20px' }}>
                            {/* <Box className="action-box" >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img src={GoldImg} alt="Icon" style={{ width: '30px' }} />
                                    <span>Buy Goldddd</span>
                                </Box>
                                <Typography sx={{ fontSize: '20px', fontWeight: 400 }}>&gt;</Typography>
                            </Box>
                            <Box className="action-box">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img src={SilverImg} alt="Icon" style={{ width: '30px' }} />
                                    <span>Buy Silver</span>
                                </Box>
                                <Typography sx={{ fontSize: '20px', fontWeight: 400 }}>&gt;</Typography>
                            </Box>
                            <Box className="action-box" onClick={() => alert("This option will be available soon")}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img src={CoinImg} alt="Icon" style={{ width: '30px', objectFit: 'contain' }} />
                                    <span>Coin/Bar</span>
                                </Box>
                                <Typography sx={{ fontSize: '20px', fontWeight: 400 }}>&gt;</Typography>
                            </Box> */}
                            {/* Gold TDS Card */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 10px',
                                borderRadius: '8px',
                                background: '#ffffff',
                                border: '1px solid #b79237',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                flex: 1,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '10px' }}>
                                    {/* <img src="/images/calling-icon.png" alt="TDS" style={{ width: '28px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
                                    <Call sx={{ width: '28px', height: '28px', color: '#b79237' }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '8px', flex: 1 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, color: '#000000', whiteSpace: 'nowrap' }}>Contact</Typography>
                                    <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#000000', fontWeight: 700 }}>9876543210</Typography>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 10px',
                                borderRadius: '8px',
                                background: '#ffffff',
                                border: '1px solid #b79237',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                flex: 1,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '10px' }}>
                                    {/* <img src="/images/calling-icon.png" alt="TDS" style={{ width: '28px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
                                    <Call sx={{ width: '28px', height: '28px', color: '#b79237' }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '8px', flex: 1 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, color: '#000000', whiteSpace: 'nowrap' }}>Account Mng</Typography>
                                    <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#000000', fontWeight: 700 }}>9876543210</Typography>
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
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <img src="/images/tds-icon.png" alt="TDS" style={{ width: '34px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
                                        <SellOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#000000' }}>TDS Number</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', color: '#000000', fontWeight: 700 }}>999988888777774</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <ContentCopyOutlined sx={{ cursor: 'pointer', color: '#b79237' }} onClick={() => { navigator.clipboard.writeText('999988888777774'); toast.success('TDS Number copied to clipboard') }} />
                                </Box>
                            </Box>

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
                                    ₹<PriceDisplay prev={goldCost.previous} curr={goldCost.current} visible={priceVisibility} flashBg /> <span className="app-unit">/gm</span>
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
                                    ₹<PriceDisplay prev={silverPrice.previous} curr={silverPrice.current} visible={priceVisibility} flashBg /> <span className="app-unit">/kg</span>
                                </div>
                                <div className="app-rate-footer">
                                    <div className="app-live-tag"><span className="app-dot red"></span> Live Rate</div>
                                    <div className={`app-change-tag ${silverDirection}`}>{silverDirection === 'up' ? '▲' : '▼'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Grid */}
                        {/* <div className="app-actions-grid">
                            <div className="app-action-box app-gold-gradient">
                                <div className="app-action-img-placeholder">
                                    <img src={GoldImg} alt="Buy Gold" />
                                </div>
                                <span className="app-action-text">Buy Gold</span>
                            </div>
                            <div className="app-action-box app-gold-gradient">
                                <div className="app-action-img-placeholder">
                                    <img src={SilverImg} alt="Buy Silver" />
                                </div>
                                <span className="app-action-text">Buy Silver</span>
                            </div>
                            <div className="app-action-box app-gold-gradient" onClick={() => alert("This option will be available soon")}>
                                <div className="app-action-img-placeholder">
                                    <img src={CoinImg} alt="Coin/Bar" />
                                </div>
                                <span className="app-action-text">Coin/Bar</span>
                            </div>
                            
                        </div> */}

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
                    </Box>
                    <Box sx={{ marginTop: '14px', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '16px' }}>

                        {/* <Box sx={{ display: 'flex', flexDirection: 'row', gap: '14px', width: '100%' }}> */}
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
                                    {/* <img src="/images/tds-icon.png" alt="TDS" style={{ width: '34px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
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
                            padding: '18px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #b79237',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            width: '100%'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* <img src="/images/tds-icon.png" alt="TDS" style={{ width: '34px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
                                    <PaymentsOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>TDS Price (99.50)</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: '#000000', fontWeight: 700 }}>Silver Cost</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography sx={{
                                    fontSize: '1.2rem',
                                    fontWeight: 800,
                                    color: '#000000',
                                }}>
                                    <PriceDisplay prefix="₹" prev={silverCostTds.previous} curr={silverCostTds.current} visible={priceVisibility} flashBg />
                                </Typography>
                            </Box>
                        </Box>
                        {/* </Box> */}
                    </Box>
                    <Box sx={{ marginTop: '14px', display: { xs: 'flex', md: 'none' }, flexDirection: 'row', gap: '16px' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 10px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #b79237',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            flex: 1,
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '10px' }}>
                                {/* <img src="/images/calling-icon.png" alt="TDS" style={{ width: '28px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
                                <Call sx={{ width: '28px', height: '28px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '8px', flex: 1 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, color: '#000000', whiteSpace: 'nowrap' }}>Contact</Typography>
                                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#000000', fontWeight: 700 }}>9876543210</Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 10px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #b79237',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            flex: 1,
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '10px' }}>
                                {/* <img src="/images/calling-icon.png" alt="TDS" style={{ width: '28px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
                                <Call sx={{ width: '28px', height: '28px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '8px', flex: 1 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, color: '#000000', whiteSpace: 'nowrap' }}>Account Mng</Typography>
                                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#000000', fontWeight: 700 }}>9876543210</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #b79237',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        marginTop: '14px',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box sx={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {/* <img src="/images/tds-icon.png" alt="TDS" style={{ width: '34px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentNode.innerHTML = '📄' }} /> */}
                                <SellOutlined sx={{ width: '30px', height: '30px', color: '#b79237' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(205, 205, 205, 0.4)', paddingLeft: '10px' }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#000000' }}>TDS Number</Typography>
                                <Typography sx={{ fontSize: '0.9rem', color: '#000000', fontWeight: 700 }}>999988888777774</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <ContentCopyOutlined sx={{ cursor: 'pointer', color: '#b79237' }} onClick={() => { navigator.clipboard.writeText('999988888777774'); toast.success('TDS Number copied to clipboard') }} />
                        </Box>
                    </Box>
                </Container>
            </section>

            {/* About Us Section */}
            <section className="about-section">
                <Container>
                    <Grid container alignItems="center" spacing={6}>
                        <Grid item xs={12} md={8}>
                            <Typography className="about-subtitle">About Us</Typography>
                            <Typography className="about-title">Diamond Bullion Gold House</Typography>

                            <Typography className="about-desc">
                                At Diamond Bullion Gold House, we are committed to excellence, purity, and trust.
                                As a distinguished name in fine jewellery and bullion trading, we specialize in
                                premium gold, silver, and certified diamond products designed to meet both lifestyle
                                and investment needs.
                            </Typography>
                            <Typography className="about-desc">
                                Our foundation is built on transparency, integrity, and long-term customer relationships.
                                We understand that jewellery is more than an accessory—it represents milestones, emotions,
                                heritage, and financial security. That is why every piece we offer reflects superior
                                craftsmanship and uncompromising quality standards.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="about-image-wrapper" style={{ margin: "0px", justifySelf: 'center' }}>
                                <img src={HeroLogoImg} alt="Hero Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </section>

            {/* Download Section */}
            <section className="download-section">
                <Container>
                    <Box className="download-card">
                        <img src={MobileImg} alt="Mobile App" className="download-phone" />
                        <Box className="download-text-content">
                            <Typography className="download-subtitle">Download Now</Typography>
                            <Typography className="download-title">Diamond Bullion Mobile App</Typography>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <img src={PlayStoreImg} alt="Play Store" className="store-btn" />
                                <img src={AppStoreImg} alt="App Store" className="store-btn" />
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </section>

            {/* Footer Section */}
            <LandingFooter />
        </React.Fragment>
    );
}

/**
 * PriceDisplay handles flashing backgrounds just like original live rates.
 */
function PriceDisplay({ prev, curr, visible, flashBg = false, defaultVal = 0, prefix = '' }) {
    const [bgColor, setBgColor] = useState('transparent');
    const [txtColor, setTxtColor] = useState('inherit');

    const renderValue = curr === 0 ? defaultVal : curr;

    useEffect(() => {
        if (visible) {
            if (curr > prev && prev !== 0) {
                if (flashBg) {
                    setBgColor('rgba(0, 180, 0, 0.8)');
                    setTxtColor('#fff');
                } else {
                    setTxtColor('#009900');
                }
            } else if (curr < prev && prev !== 0) {
                if (flashBg) {
                    setBgColor('rgba(255, 0, 0, 0.8)');
                    setTxtColor('#fff');
                } else {
                    setTxtColor('#cc0000');
                }
            } else {
                setBgColor('transparent');
                setTxtColor('inherit');
            }

            const timer = setTimeout(() => {
                setBgColor('transparent');
                setTxtColor('inherit');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [curr, prev, visible, flashBg]);

    if (!visible) return <span>--</span>;

    const formatted = new Intl.NumberFormat("en-IN").format(parseFloat(renderValue.toFixed(2)));

    return (
        <span
            className={flashBg ? "price-flash" : ""}
            style={{ backgroundColor: bgColor, color: txtColor, transition: 'background-color 0.1s' }}
        >
            {prefix}{formatted}
        </span>
    );
}
