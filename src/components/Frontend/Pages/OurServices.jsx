import { Box, Typography } from "@mui/material";
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageListItem from '@mui/material/ImageListItem';
import GoldBars from "../../../assets/images/gold.png";

import GoldCoins from "../../../assets/images/gold_coins.png";

export default function OurServices(){
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
                    "::before":{
                        "content": `""`,
                        "position": "absolute",
                        "width": "12%",
                        "bottom": "0%",
                        "left": "44%",
                        "borderBottom": "2px solid black",
                        "boxSizing":"border-box",
                    }
                }}
                >
                    Our Services
                </Typography>
                <Box sx={{
                    display:{md:"flex",xs:"block"},
                    justifyContent:"space-around",
                    alignItems:"center"
                    }}>
                    
                    <ImageListItem sx={{}}>
                        <img src={GoldBars} width="100%" height="100%" />
                        <ImageListItemBar
                            title={"Buy Gold"}
                            sx={{
                                textAlign:"center",
                                bottom:"5%",
                                bgcolor:"#000088",
                            }}
                        />
                    </ImageListItem>
                    <ImageListItem sx={{
                        
                    }}>
                        <img src={GoldCoins} width="100%" height="100%" />
                        <ImageListItemBar
                            title={"Buy Gold Coins"}
                            sx={{
                                textAlign:"center",
                                bottom:"5%",
                                bgcolor:"#000088",
                            }}
                        />
                    </ImageListItem>
                    
                </Box>
            </Box>
        </>
    );
}