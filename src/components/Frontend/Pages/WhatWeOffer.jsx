import { Box, Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import SellIcon from '@mui/icons-material/Sell';
import SmsIcon from '@mui/icons-material/Sms';
import PaidIcon from '@mui/icons-material/Paid';

export default function WhatWeOffer(){
    return (
        <>
            <Box sx={{
                }}>
                <Typography
                variant="h4"
                sx={{
                    position:"relative",
                    textAlign:"center",
                    fontWeight:700,
                    color:"black",
                    "::before":{
                        "content": `""`,
                        "position": "absolute",
                        "width": "14%",
                        "bottom": "0%",
                        "left": "44%",
                        "borderBottom": "2px solid black",
                        "boxSizing":"border-box",
                    }
                }}
                >
                    What We Offer
                </Typography>
                <Box sx={{
                    p:4,
                    display:{md:"flex",xs:"block"},
                    justifyContent:"space-around",
                    alignItems:"center"
                    }}>
                    <Box sx={{
                            flex:1,
                            "textAlign": "-webkit-center",
                        }}>
                        <Avatar sx={{ width: 100, height: 100, mb:2, bgcolor:"#000088" }}>
                            <SellIcon fontSize="large"/>
                        </Avatar>
                        <Typography 
                            variant="h6"
                        >
                            Best Price
                        </Typography>
                    </Box>
                    <Box sx={{
                            flex:1,
                            "textAlign": "-webkit-center",
                        }}>
                        <Avatar sx={{ width: 100, height: 100, mb:2, bgcolor:"#000088"}}>
                            <SmsIcon fontSize="large"/>
                        </Avatar>
                        <Typography 
                            variant="h6"
                            sx={{
                                textWrap:"wrap"
                            }}
                        >
                            Instant Confirmation via SMS & Whatsapp
                        </Typography>
                    </Box>
                    <Box sx={{
                            flex:1,
                            "textAlign": "-webkit-center",
                        }}>
                        <Avatar sx={{ width: 100, height: 100, mb:2, bgcolor:"#000088"}}>
                            <PaidIcon fontSize="large" />
                        </Avatar>
                        <Typography 
                            variant="h6"
                        >
                            Buy Gold Coins
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
}