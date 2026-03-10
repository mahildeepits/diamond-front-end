import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import Android from "../../../assets/images/android.png";
import Iphone from "../../../assets/images/iphone.png";
import AppStoreImage from "../../../assets/images/app_store.png"; // Replace with your actual App Store button image
import PlayStoreImage from "../../../assets/images/play_store.png"; // Replace with your actual Play Store button image
import Banner from "../Pages/Banner";

export default function AboutUs() {
    return (
        <>
            <Banner name={"About Us"}/>
            {/* Container for Cards */}
            
                {/* Card 1 */}
                <Card sx={{
                    m:4,
                    px:5,
                    py:2
                }}>
                    <CardContent>
                        <Box position={'relative'}>
                            <Typography
                                variant="h5"
                                mb={2}
                                sx={{
                                    fontWeight:"500",
                                    "::before":{
                                        "content": `""`,
                                        "position": "absolute",
                                        "width": "140px",
                                        "top": "30px",
                                        "left": "0%",
                                        "borderBottom": "2px solid black",
                                        "boxSizing":"border-box",
                                    }
                                }}
                                
                            >
                            Our Vission
                            </Typography>
                            <Typography variant="body1">
                                <p>
                                    To be the most reputed and respected bullion dealer of India
                                </p>
                            </Typography>
                        </Box>
                        <Box position={'relative'}>
                            <Typography
                                variant="h5"
                                my={2}
                                sx={{
                                    fontWeight:"500",
                                    "::before":{
                                        "content": `""`,
                                        "position": "absolute",
                                        "width": "145px",
                                        "top": "30px",
                                        "left": "0%",
                                        "borderBottom": "2px solid black",
                                        "boxSizing":"border-box",
                                    }
                                }}
                            >
                            Our Mission
                            </Typography>
                            <Typography variant="body1">
                                <p>
                                To Give the best satisfcation and services to our clients with assured quality of precious metals, assured delivery, most competitive price and honest & transparent dealings.
                                </p>
                            </Typography>
                        </Box>
                        <Box position={'relative'}>
                            <Typography
                                variant="h5"
                                my={2}
                                sx={{
                                    fontWeight:"500",
                                    "::before":{
                                        "content": `""`,
                                        "position": "absolute",
                                        "width": "116px",
                                        "top": "30px",
                                        "left": "0%",
                                        "borderBottom": "2px solid black",
                                        "boxSizing":"border-box",
                                    }
                                }}
                            >
                           About Us
                            </Typography>
                            <Typography variant="body1">
                                <p>Ansh Jewellers is a leading bullion dealer of Punjab since the year 1998. We have rich experience of bullion market for last 22 years and our reputation and business has grown steadily in last 2 decades.</p>
                                <p>
                                We are pleased to inform you that Ansh Jewellers will be moving into a new firm. With an effect from 25th JUNE, 2020 our organization will be as MKS Bullion and Ansh Jewellers.
                                </p>
                                <p>
                                Our Founder and CEO Mr. Amritpal Singh is one of the most trusted and reputed Bullion Dealer of Bullion Market Capital of India - Punjab.
                                </p>
                                <p>
                                He has deep knowledge of all aspects of World Bullion Market and has vast experience and expertise in the field of importing and distributing Gold Bars and Silver Bars. He is also a member of India Bullion and Jewellers Association Ltd (IBJA).
                                </p>
                                <p>
                                Ansh Jewellers is the first choice for sourcing Gold Bars and Coins and Silver Bars and Coins of assured certified quality and best price.
                                </p>
                                <p>
                                We strive to give best services and satisfaction to our clients through professional approach, hard work, latest technology and customer friendly dealing
                                </p>
                                <p>
                                We strive to give best services and satisfaction to our clients through professional approach, hard work, latest technology and customer friendly dealing
                                </p>
                                <p>
                                It brings us satisfaction and fullfilment when our clients are happy.
                                </p>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
        </>
    );
}
