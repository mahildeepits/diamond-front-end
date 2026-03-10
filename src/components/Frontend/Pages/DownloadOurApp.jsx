import { Box, Typography } from "@mui/material";
import AppStoreImage from "../../../assets/images/app_store.png"; // Replace with your actual App Store button image
import PlayStoreImage from "../../../assets/images/play_store.png";
import BannerImage from "../../../assets/images/banner.png";
export default function DownloadOurApp(){
    return (
        <>
            <Box sx={{
                    py:2
                }}>
                <Typography
                variant="h4"
                sx={{
                    position:"relative",
                    textAlign:"center",
                    fontWeight:700,
                    color:"black",
                    mb:2,
                    "::before":{
                        "content": `""`,
                        "position": "absolute",
                        "width": "15%",
                        "bottom": "0%",
                        "left": "44%",
                        "borderBottom": "2px solid black",
                        "boxSizing":"border-box",
                    }
                }}
                >
                    Download Our App
                </Typography>
                <Box sx={{
                    display:{md:"flex"},
                    justifyContent:"space-between",
                    alignItems:"center",
                    textAlign:"center"
                    }}>
                    <Box sx={{
                        flex:2
                    }}>
                        <Box>
                            <img src={BannerImage} width="100%" />
                        </Box>
                    </Box>
                    <Box sx={{
                        flex:1,
                        display:{md:"block",xs:"flex"},
                        justifyContent:"space-between",
                        pt:{md:0,xs:4}
                    }}>
                        <Box>
                            <img src={PlayStoreImage} alt="Google Play" width="60%" height="100%" />
                        </Box>
                        <Box>
                            <img src={AppStoreImage} alt="App Store" width="60%" height="100%" />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}