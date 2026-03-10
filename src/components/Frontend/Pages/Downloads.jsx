import { Box, Card, CardContent, Container, Typography, Button } from "@mui/material";
import Android from "../../../assets/images/android.png";
import Iphone from "../../../assets/images/iphone.png";
import AppStoreImage from "../../../assets/images/app_store.png"; // Replace with your actual App Store button image
import PlayStoreImage from "../../../assets/images/play_store.png"; // Replace with your actual Play Store button image
import Banner from "../Pages/Banner";

export default function Downloads() {
    return (
        <>
        <Banner name={"Download"} />
        <Card>
            <CardContent>
                <Container>
                    {/* <Box>
                        <Box sx={{
                            display:"flex",
                            justifyContent:"space-between",
                            alignItems:"center",
                            textAlign:"center"
                            }}>
                            <Box sx={{
                                flex:2
                            }}>
                                <Box>
                                    <img src="./src/assets/images/banner2.png" width="100%" />
                                </Box>
                            </Box>
                            <Box sx={{
                                flex:1
                            }}>
                                <Box>
                                    <img src={PlayStoreImage} alt="Google Play" width="50%" height="100%" />
                                </Box>
                                <Box>
                                    <img src={AppStoreImage} alt="App Store" width="50%" height="100%" />
                                </Box>
                            </Box>
                        </Box>
                    </Box> */}
                    <Box
                        sx={{
                            display: {md:"flex",xs:"block"},
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                            margin: "0 auto",
                            padding: 2,
                            maxWidth: "1200px",
                        }}
                    >
                        {/* Card 1 */}
                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    width: "25%",
                                    margin: "20px auto",
                                    textAlign: "center",
                                }}
                                >
                                <img src={Android} height={"100%"} width={"100%"} alt="Mobile Preview" />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 2,
                                    marginTop: 2,
                                }}
                                >
                                {/* Google Play Button */}
                                <Button
                                    sx={{
                                        padding: 0,
                                        minWidth: "150px",
                                        height: "40px",
                                    }}
                                >
                                    <img src={PlayStoreImage} alt="Google Play" width="100%" height="100%" />
                                </Button>
                            </Box>
                        </Box>
                        {/* Card 2 */}
                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    width: "25%",
                                    margin: "20px auto",
                                    textAlign: "center",
                                }}
                                >
                                <img src={Iphone} height={"100%"} width={"100%"} alt="Mobile Preview" />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 2,
                                    marginTop: 2,
                                }}
                                >
                                {/* App Store Button */}
                                <Button
                                    sx={{
                                        padding: 0,
                                        minWidth: "150px",
                                        height: "40px",
                                    }}
                                >
                                    <img src={AppStoreImage} alt="App Store" width="100%" height="100%" />
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </CardContent>
        </Card>
            
        </>
    );
}
